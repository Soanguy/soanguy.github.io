// parse-task.js
exports.handler = async (event) => {
    // 只接受 POST 请求
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    // CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    try {
        const { text } = JSON.parse(event.body);

        // 支持单条或批量输入：text 可以是 string 或 string[]
        const inputLines = Array.isArray(text) ? text : [text];

        // 过滤空行
        const validLines = inputLines.filter(t => typeof t === 'string' && t.trim().length > 0);
        if (validLines.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing or invalid text' })
            };
        }

        const apiKey = process.env.SILICONFLOW_API_KEY;
        if (!apiKey) {
            console.error('Missing SILICONFLOW_API_KEY environment variable');
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Server configuration error' })
            };
        }

        const apiUrl = process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1';

        const today = new Date().toISOString().split('T')[0];
        const systemPrompt = `你是学习任务解析助手。用户用自然语言描述任务，每行一个，提取信息返回JSON数组。

今天是 ${today}。

用户输入（自然语言，格式随意）：
- 做20道数学题
- 背50个英语单词，每天都要
- 明天下午3点复习物理
- 预习化学第三章，周三之前搞定
- 整理错题本，不急
- 阅读古诗词5篇，高优先级
- 下周一考英语，要背完单词

规则：
1. content = 任务核心内容，只保留"做什么"，去掉所有修饰（时间、数量、优先级、重复、语气词）
   ✅ "背英语单词"  ❌ "英语单词，都要"  ❌ "都要"
   ✅ "复习物理"  ❌ "下午物理"  ❌ "下午"
   ✅ "预习化学第三章"  ❌ "化学第三章，之前搞定"
   ✅ "整理错题本"  ❌ "整理错题本，"
   ✅ "阅读古诗词"  ❌ "古诗词，"
   ✅ "背单词"  ❌ "下考英语，要完单词"

2. type: practice(做题/练习/刷题)、review(复习/整理)、recite(背诵/背)、preview(预习/阅读)
3. date: YYYY-MM-DD，识别今天/明天/后天/周X/下周X/X月X日等，未指定则今天
4. quantity: 从"20道""50个""5篇"提取数字，无则null
5. priority: "高/紧急/重要"→high，"低/不急"→low，默认medium
6. repeat: "每天/每日/都要"→daily，"每周"→weekly，无则null
7. remindTime: HH:MM，从"下午3点""15:00"等提取，无则null

返回格式：[{"content":"做数学题","type":"practice","date":"${today}","quantity":20,"priority":"medium","repeat":null,"remindTime":null}, ...]
只返回JSON数组。`;

        const combinedText = validLines.join('\n');

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: process.env.SILICONFLOW_MODEL || 'Qwen/Qwen3-8B',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: combinedText }
                ],
                temperature: 0.1,
                max_tokens: 1500,
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('AI API error:', response.status, errorText);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: 'AI service error' })
            };
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'AI returned empty response' })
            };
        }

        // 尝试解析 JSON
        let parsed;
        try {
            parsed = JSON.parse(content);
        } catch (e) {
            const jsonMatch = content.match(/\[.*\]/s);
            if (jsonMatch) {
                try {
                    parsed = JSON.parse(jsonMatch[0]);
                } catch (e2) {
                    // 尝试单个对象
                    const objMatch = content.match(/\{.*\}/s);
                    if (objMatch) {
                        parsed = [JSON.parse(objMatch[0])];
                    } else {
                        return {
                            statusCode: 500,
                            body: JSON.stringify({ error: 'Invalid JSON from AI' })
                        };
                    }
                }
            } else {
                return {
                    statusCode: 500,
                    body: JSON.stringify({ error: 'Invalid JSON from AI' })
                };
            }
        }

        // 确保返回数组
        const results = Array.isArray(parsed) ? parsed : [parsed];

        // 校验每个结果
        const today = new Date().toISOString().split('T')[0];
        const sanitized = results.map(item => ({
            content: item.content || '未命名任务',
            type: ['practice', 'review', 'recite', 'preview'].includes(item.type) ? item.type : 'practice',
            date: item.date || today,
            quantity: item.quantity !== undefined && item.quantity !== null ? Number(item.quantity) : null,
            priority: ['high', 'medium', 'low'].includes(item.priority) ? item.priority : 'medium',
            repeat: ['daily', 'weekly'].includes(item.repeat) ? item.repeat : null,
            remindTime: item.remindTime || null
        }));

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(sanitized)
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};