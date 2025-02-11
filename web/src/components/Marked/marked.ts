import hljs from 'highlight.js';
import { Marked, type TokenizerAndRendererExtension } from 'marked';
import { markedHighlight } from 'marked-highlight';

const thinkExtension: TokenizerAndRendererExtension = {
	name: 'think',
	level: 'block', // 或者 inline，看你想怎样解析（通常思考过程是块级内容）
	start(src) {
		// 返回匹配 <think> 的位置，确保只从标签开始处进行解析
		const match = src.match(/<think>/);
		return match ? match.index : undefined;
	},
	tokenizer(src) {
		// 定义一个正则，匹配 <think> 标签中的内容（非贪婪模式）
		const rule = /^<think>([\s\S]+?)<\/think>/;
		const match = rule.exec(src);
		if (match) {
			return {
				type: 'think', // 自定义 token 类型
				raw: match[0], // 完整匹配到的字符串
				text: match[1], // 标签内的内容
			};
		}

		if (src.startsWith('<think>')) {
			return {
				type: 'think', // 自定义 token 类型
				raw: src, // 完整匹配到的字符串
				text: src.replace('<think>', ''), // 标签内的内容
			};
		}
	},
	renderer(token) {
		const paragrams: string[] = token.text.trim().split('\n\n').filter(Boolean);
		if (!paragrams.length) {
			return;
		}
		// 将自定义 token 渲染成你希望的 HTML，比如加上一个特定的 CSS 类
		return `<div class="think">${paragrams
			.map((p) => `<p>${p}</p>`)
			.join('')}</div>`;
	},
};

export const marked = new Marked({
	pedantic: false,
	gfm: true,
	silent: true,
	breaks: true,
	extensions: [thinkExtension],
}).use(
	markedHighlight({
		emptyLangClass: 'hljs',
		langPrefix: 'hljs language-',
		highlight(code, lang) {
			const language = hljs.getLanguage(lang) ? lang : 'plaintext';
			return hljs.highlight(code, { language }).value;
		},
	}),
);
