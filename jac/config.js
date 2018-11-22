/**
 * 记事本配置脚本。
 */
var notebook = {
	// 记事本根目录的识别项，为准确识别，前后都应包含斜线
	"rootPath": "/notebook/",
	// 文件默认的扩展名
	"fileExt": ".html",
	// 左侧菜单栏 HTML 中的 id 前缀，用于下拉菜单
	"menuId": "accordion",

	// 左侧菜单栏
	"menu": [
		{
			// 绝对路径，而不是前后斜线
			"path": "/",
			// 下拉菜单项的文字
			"label": "首页",
			// 下拉菜单内的列表项目，可以用数组嵌套，表示下级菜单
			"items": [
				{"label": "记事本首页", "file": "index"}
			]
		},
		{
			/**
			 * 默认是相对上级目录的路径，前后都不包含斜线。
			 * 可以包含绝对路径或相对路径，但不能使用 .. 返回上级目录。
			 * 注意：菜单 HTML 代码中的 id 是根据换算后的真实路径生成的，重复的路径会生成相同的 id，这可能导致 HTML 的结果并不符合预期。
			 */
			"path": "docs",
			"label": "帮助文档",
			"items": [
				/**
				 * file 的默认路径从当前 path 开始算起。
				 * 可以包含绝对路径或相对路径，但不能使用 .. 返回上级目录。
				 */
				{"label": "介绍与配置", "file": "index"},
				{"label": "模板说明", "file": "template"},
				{"label": "静态页面", "file": "static"},
				{"label": "文档模板", "file": "document"},
				{"label": "多步页面模板", "file": "step"},
				{"label": "日历模板", "file": "calendar"},
				{"label": "时间轴模板", "file": "timeline"},
				{"label": "筛选页面模板", "file": "filter"},
				{"label": "其它事项说明", "file": "issue"}
			]
		},
		{
			"path": "cheat",
			"label": "速查手册",
			"items": [
				{"label": "手册说明", "file": "index"},
				{"label": "Markdown 语法", "file": "markdown"},
				{"label": "Git 命令", "file": "git"}
			]
		}
	],

	// 用 Markdown 书写文字的段落 class
	"markdownClass": "markdown"
};
