/**
 * 记事本通用脚本。
 */
;(function(){
	var fullName = location.pathname, nameArray;
	// 根据 config.js 中的记事本根目录识别项获取含相对路径的当前文件名
	fullName = fullName.substring(fullName.indexOf(notebook.rootPath) + notebook.rootPath.length);
	nameArray = fullName.split("/");
	// 仅当前文件名
	var fileName = nameArray.pop();
	// 仅当前路径
	var pathName = nameArray.join("/");
	// 从当前路径返回根目录的路径前缀
	var pathPrefix = new Array(nameArray.length + 1).join("../");

	// 在 #menu 内生成折叠菜单
	if (document.getElementById("menu")) {
		// 菜单模板
		var accordionTemplate =
			'<div class="accordion">' +
				'<input id="{id}" {checked} name="accordion-checkbox" type="checkbox" hidden="" />' +
				'<label class="accordion-header c-hand" for="{id}">' +
					'<i class="icon icon-arrow-right"></i> {label}' +
				'</label>' +
				'<div class="accordion-body">' +
					'<ul class="menu menu-nav">' +
						'{items}' +
					'</ul>' +
				'</div>' +
			'</div>';
		var itemTemplate = '<li class="menu-item"><a class="{active}" href="{href}">{label}</a></li>';
		var nestTemplate = '<li class="menu-item">{nest}</li>';

		/**
		 * 根据菜单配置（JSON）生成可折叠菜单（HTML）
		 * @param array accConfig 菜单配置数组
		 * @param string accPath 该配置项所属的路径
		 * @return string 可折叠菜单代码（HTML）
		 */
		function renderMenu(accConfig, accPath) {
			var accordions, lists, nowPath, itemHref, accordionId, config, item;

			accordions = "";
			for (config in accConfig) {
				nowPath = accConfig[config].path.charAt(0) === "/"
					? accConfig[config].path.substring(1)
					: (accPath ? accPath + "/" : "") + accConfig[config].path;

				lists = "";
				for (item in accConfig[config].items) {
					if (Array.isArray(accConfig[config].items[item])) {
						lists += nestTemplate.replace(/(.*){nest}(.*)/,
							"$1" + renderMenu(accConfig[config].items[item], nowPath) + "$2");
					}
					else {
						itemHref = (
								accConfig[config].items[item].file.charAt(0) === "/"
								? accConfig[config].items[item].file.substring(1)
								: (nowPath ? nowPath + "/" : "") + accConfig[config].items[item].file
							) + notebook.fileExt;

						lists += itemTemplate.replace(/(.*){active}(.*){href}(.*){label}(.*)/,
							"$1" + (itemHref === fullName ? "active" : "") +
							"$2" + pathPrefix + itemHref +
							"$3" + accConfig[config].items[item].label + "$4");
					}
				}

				accordionId = notebook.menuId + (nowPath ? "-" + nowPath.replace(/\//g, "-") : "");
				accordions += accordionTemplate.replace(/(.*){id}(.*){checked}(.*){id}(.*){label}(.*){items}(.*)/,
					"$1" + accordionId +
					"$2" + (pathName === nowPath || pathName.indexOf(nowPath + "/") === 0 ? 'checked=""' : '') +
					"$3" + accordionId +
					"$4" + accConfig[config].label +
					"$5" + lists + "$6");
			}

			return accordions;
		}

		document.getElementById("menu").innerHTML = renderMenu(notebook.menu);
	}

	// 转化 .markdown 段落内的 markdown 内容
	if (typeof marked !== "undefined") {
		var markdownSections = document.getElementsByClassName(notebook.markdownClass);

		// 修改 Markdown 的默认解析方式
		var renderer = new marked.Renderer();
		renderer.checkbox = function(checked) {
			return '<i class="icon icon-'
			+ (checked ? 'check' : 'plus')
			+ ' label label-'
			+ (checked ? 'success' : 'error')
			+'"></i> ';
		}
		renderer.code = function(code, lang, escaped) {
			if (this.options.highlight) {
				var out = this.options.highlight(code, lang);
				if (out != null && out !== code) {
					escaped = true;
					code = out;
				}
			}

			if (!lang) {
				return '<pre class="code"><code>'
					+ (escaped ? code : marked.escape(code, true))
					+ '</code></pre>';
			}

			return '<pre class="code" data-lang="' + lang + '"><code class="'
				+ this.options.langPrefix
				+ marked.escape(lang, true)
				+ '">'
				+ (escaped ? code : marked.escape(code, true))
				+ '</code></pre>\n';
		};
		renderer.table = function(header, body) {
			if (body) body = '<tbody>' + body + '</tbody>';

			return '<table class="table table-striped">\n'
			+ '<thead>\n'
			+ header
			+ '</thead>\n'
			+ body
			+ '</table>\n';
		};
		renderer.hr = function() {
			return '<div class="divider"></div>';
		};
		renderer.strong = function(text) {
			return '<ins>' + text + '</ins>';
		};
		renderer.em = function(text) {
			return '<mark>' + text + '</mark>';
		};

		for(var i = 0; i < markdownSections.length; i++) {
			markdownSections[i].innerHTML = marked(
				markdownSections[i].innerHTML.replace(/--!>/gm, "-->").split('\n').slice(2,-2).join('\n'),
				{
					"renderer": renderer,
					"headerIds": false
				}
			);
		}
	}

	// 在 #pathname 内显示当前页面路径
	if (document.getElementById("pathname")) {
		document.getElementById("pathname").setAttribute("data-content", fullName);
	}
})();
