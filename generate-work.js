#!/usr/bin/env node
/**
 * generate-work.js — 从作品标题和代码生成独立沉浸式 HTML 页面
 *
 * 用法:
 *   node generate-work.js "作品标题" "代码字符串"
 *   echo "代码" | node generate-work.js "作品标题"
 *
 * 输出: works/作品英文slug.html
 * 默认模板: immersive-viewer.html
 */

const fs = require('fs');
const path = require('path');

function main() {
  if (process.argv.length < 3) {
    console.error('用法: node generate-work.js "作品标题" [代码字符串]');
    console.error('       echo "代码" | node generate-work.js "作品标题"');
    process.exit(1);
  }

  const title = process.argv[2];
  let code = process.argv[3];

  if (!code) {
    // Read from stdin
    code = fs.readFileSync('/dev/stdin', 'utf-8').trim();
  }

  if (!code) {
    console.error('错误: 代码不能为空');
    process.exit(1);
  }

  // Generate slug
  let slug = title.toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!slug || /^[a-z0-9]+$/.test(slug)) slug = 'artwork';
  // If still problematic, just use a hash
  if (!slug || slug === 'artwork') {
    const hash = Date.now().toString(36);
    slug = `artwork-${hash}`;
  }

  const outfile = path.join('works', `${slug}.html`);

  // Read template
  const templatePath = 'immersive-viewer.html';
  if (!fs.existsSync(templatePath)) {
    console.error('错误: 找不到', templatePath);
    process.exit(1);
  }

  let html = fs.readFileSync(templatePath, 'utf-8');

  // Code as JSON string
  const codeJson = JSON.stringify(code);

  // Replace placeholders
  html = html.replace(/\{\{TITLE\}\}/g, title);
  html = html.replace(/\{\{CODE_JSON\}\}/g, codeJson);

  // Write output
  fs.writeFileSync(outfile, html, 'utf-8');

  console.log(`✅ 生成: ${outfile}`);
  console.log(`🌐 URL: https://aprilssky.github.io/p5js-art/${outfile}`);
}

main();
