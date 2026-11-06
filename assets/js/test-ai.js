// test-ai.js - 本地测试 SiliconFlow API
// 使用方法: SILICONFLOW_API_KEY=你的密钥 node test-ai.js

const apiKey = process.env.SILICONFLOW_API_KEY;
if (!apiKey) {
    console.error('请设置环境变量 SILICONFLOW_API_KEY');
    process.exit(1);
}

const apiUrl = process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1/chat/completions';
const model = process.env.SILICONFLOW_MODEL || 'Qwen/Qwen2.5-7B-Instruct';

const testInput = `做20道数学题，高优先级
背50个英语单词，每天都要
明天下午3点复习物理
预习化学第三章，周三之前搞定
整理错题本，不急
阅读古诗词5篇，高优先级
下周一考英语，要背完单词`;

const today = new Date().toISOString().split('T')[0];

const systemPrompt = `你是学习任务解析助手。将用户输入的中文任务解析为JSON数组。

今天是 ${today}。

任务格式：每行一个任务。

输出格式（严格JSON数组）：
[
  {"content":"任务内容","type":"practice","date":"${today}","quantity":null,"priority":"medium","repeat":null,"remindTime":null}
]

字段说明：
- content: 任务核心内容
- type: practice(做题)、review(复习)、recite(背诵)、preview(预习)
- date: YYYY-MM-DD
- quantity: 数量，无则null
- priority: high/medium/low
- repeat: daily/weekly/null
- remindTime: HH:MM/null

只输出JSON数组，不要其他文字。`;

async function test() {
    console.log('测试输入:');
    console.log(testInput);
    console.log('\n调用 API:', apiUrl);
    console.log('模型:', model);
    console.log('发送中...\n');

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: testInput }
                ],
                temperature: 0.1,
                max_tokens: 2000,
            })
        });

        console.log('HTTP 状态:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('错误:', errorText);
            return;
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        console.log('AI 返回:');
        console.log(content);

        // 尝试解析 JSON
        try {
            const parsed = JSON.parse(content);
            console.log('\n✅ JSON 解析成功!');
            console.log(`共 ${parsed.length} 条任务:`);
            parsed.forEach((task, i) => {
                console.log(`  ${i+1}. ${task.content} [${task.type}] ${task.date} ${task.quantity ? task.quantity+'道' : ''}`);
            });
        } catch (e) {
            console.error('\n❌ JSON 解析失败:', e.message);
            console.log('\n原始返回:');
            console.log(content);
        }
    } catch (error) {
        console.error('请求失败:', error.message);
    }
}

test();
