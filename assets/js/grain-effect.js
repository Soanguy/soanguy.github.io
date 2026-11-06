(function () {
  'use strict';

  const date = new Date();
  const hour = date.getHours();

  // 时间配置：晚上 21:00 到次日 6:00 显示噪音效果
  const startHour = 18;  // 晚上 9 点开始
  const endHour = 6;     // 早上 6 点结束

  // 判断是否应该显示噪音效果
  const shouldShowGrain = hour >= startHour || hour < endHour;

  if (!shouldShowGrain) {
    // 白天：移除噪音和时钟（如果存在）
    document.querySelectorAll('.grain, #dwclock').forEach(e => {
      e.remove();
    });
    return;
  }

  // 晚上：添加噪音和时钟

  // 创建噪音层
  const grain = document.createElement('div');
  grain.className = 'grain';
  document.body.appendChild(grain);

  // 创建时钟容器
  const clock = document.createElement('div');
  clock.id = 'dwclock';
  clock.innerHTML = `
        <div id="min"><div class="hand"></div></div>
        <div id="hour"><div class="hand"></div></div>
    `;
  document.body.appendChild(clock);

  // 更新时钟指针
  const minHand = clock.querySelector('#min .hand');
  const hourHand = clock.querySelector('#hour .hand');

  function updateClock() {
    const now = new Date();
    const minutes = now.getMinutes();
    const hours = now.getHours();
    const seconds = now.getSeconds();

    // 计算角度
    const minutesDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6);
    const hourDegrees = ((hours / 12) * 360) + ((minutes / 60) * 30);

    if (minHand && hourHand) {
      minHand.style.transform = `rotate(${minutesDegrees}deg)`;
      hourHand.style.transform = `rotate(${hourDegrees}deg)`;
    }
  }

  // 初始化时钟
  updateClock();

  // 每 10 秒更新一次：没有秒针，且指针带 2vmin 模糊，
  // 1° 的步进（针尖约 3px）肉眼不可见，没必要每秒重绘
  setInterval(updateClock, 10000);

  // 检查是否到达白天，自动移除效果
  function checkTime() {
    const currentHour = new Date().getHours();
    if (currentHour >= endHour && currentHour < startHour) {
      // 到达白天，移除效果
      document.querySelectorAll('.grain, #dwclock').forEach(e => {
        e.remove();
      });
      // 停止检查
      clearInterval(checkInterval);
    }
  }

  // 每分钟检查一次时间
  const checkInterval = setInterval(checkTime, 60000);
})();
