(function () {
  'use strict';

  var PAGES = {
    summaries: [
      'summaries/chapter-1-&-2-introduction-to-prolog.html',
      'summaries/chapter-3-prolog-rules-&-recursion.html',
      'summaries/chapter-4-prolog-syntax-&-structures.html',
      'summaries/chapter-5-part-1-lists-and-arithmetic.html',
      'summaries/chapter-5-part-2-lists-and-arithmetic.html',
      'summaries/chapter-6-controlling-backtracking.html',
      'summaries/chapter-7-input-and-output.html'
    ],
    'practice-examples': [
      'practice-examples/chapter-1-&-2-practice.html',
      'practice-examples/chapter-3-practice.html',
      'practice-examples/chapter-4-practice.html',
      'practice-examples/chapter-5-(part-1)-practice.html',
      'practice-examples/chapter-5-(part-2)-practice.html',
      'practice-examples/chapter-6-practice.html',
      'practice-examples/chapter-7-practice.html'
    ]
  };

  function getRootPrefix() {
    var path = window.location.pathname;
    if (path.endsWith('prolog-index.html') || path === '/' || path.match(/\/$/)) {
      return 'site-lib';
    }
    if (path.indexOf('/summaries/') !== -1 || path.indexOf('/practice-examples/') !== -1) {
      return '../site-lib';
    }
    return 'site-lib';
  }

  function expandAll(el) {
    var collapsed = el.querySelectorAll('.callout.is-collapsible.is-collapsed');
    for (var i = 0; i < collapsed.length; i++) {
      collapsed[i].classList.remove('is-collapsed');
      var content = collapsed[i].querySelector('.callout-content');
      if (content) content.style.display = '';
    }
  }

  function extractContent(doc) {
    var section = doc.querySelector('.markdown-preview-section');
    if (!section) return '';
    var html = '';
    var el = section.firstElementChild;
    while (el) {
      if (el.classList && el.classList.contains('footer')) break;
      html += el.outerHTML;
      el = el.nextElementSibling;
    }
    return html;
  }

  function getPageTitle(doc) {
    var titleEl = doc.querySelector('.page-title');
    if (titleEl && titleEl.textContent) return titleEl.textContent.trim();
    var heading = doc.querySelector('.markdown-preview-section h1');
    if (heading && heading.textContent) return heading.textContent.trim();
    return (doc.title || '').trim();
  }

  window.downloadSinglePDF = function () {
    window.print();
  };

  window.downloadFolderPDF = async function (folderName) {
    var pages = PAGES[folderName];
    if (!pages) return;

    var rootPrefix = getRootPrefix();
    var prefix = folderName === 'summaries' ? 'summaries/' : 'practice-examples/';

    var allContent = '';
    var folderTitle = folderName === 'summaries' ? 'التلخيصات' : 'التدريبات';

    for (var i = 0; i < pages.length; i++) {
      var page = pages[i];
      try {
        var resp = await fetch(page);
        var html = await resp.text();
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        expandAll(doc);
        var content = extractContent(doc);
        var pageTitle = getPageTitle(doc);
        if (pageTitle) {
          content = '<div class="header"><h1 class="page-title">' + pageTitle + '</h1></div>' + content;
        }
        if (content) {
          allContent += '<div class="pdf-page">' + content + '</div>';
        }
      } catch (e) {
        console.warn('Failed to fetch:', page, e);
      }
    }

    if (!allContent) {
      alert('\u274C \u062A\u0639\u0630\u0631 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u062D\u062A\u0648\u0649. \u064A\u0631\u062C\u0649 \u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u0645\u0648\u0642\u0639 \u0639\u0644\u0649 \u062E\u0627\u062F\u0645 HTTP.');
      return;
    }

    var isDark = document.body.classList.contains('theme-dark');
    var themeClass = isDark ? 'theme-dark' : 'theme-light';
    var bgColor = isDark ? '#100e17' : '#ffffff';
    var textColor = isDark ? '#bebebe' : '#1a1a1a';

    var win = window.open('', '_blank');
    win.document.write('<!DOCTYPE html><html lang="ar"><head><meta charset="UTF-8">');
    win.document.write('<title>Prolog - ' + folderTitle + '</title>');
    win.document.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    win.document.write('<link rel="stylesheet" href="' + rootPrefix + '/styles/obsidian.css">');
    win.document.write('<link rel="stylesheet" href="' + rootPrefix + '/styles/theme.css">');
    win.document.write('<link rel="stylesheet" href="' + rootPrefix + '/styles/global-variable-styles.css">');
    win.document.write('<link rel="stylesheet" href="' + rootPrefix + '/styles/main-styles.css">');
    win.document.write('<link rel="stylesheet" href="' + rootPrefix + '/styles/print.css">');
    win.document.write('<style>.theme-dark{--background-primary:#100e17;--background-primary-alt:#0d0b12;--background-secondary:#191621;--background-secondary-alt:#0d0b12;--text-normal:#bebebe;--text-accent:#0fb6d6;--text-sub-accent:#f4569d;--text-dim:#45aaff;--text-faint:#7aa2f7;--text-title-h1:var(--text-accent);--text-title-h2:#cbdbe5;--text-title-h3:#cbdbe5;--text-title-h4:#cbdbe5;--text-title-h5:#cbdbe5;--text-link:#b4b4b4;--text-a:#6bcafb;--text-a-hover:#6bcafb;--text-mark:#263d92;--code-background:var(--background-secondary);--interactive-accent:rgba(14, 210, 247, 0.5);--interactive-accent-hover:rgba(14, 210, 247, 0.8);--interactive-before:#5e6565;--blockquote-border:#4aa8fb;--tag-background:rgba(14, 210, 247, 0.15);--interactive-accent-rgb:#3dd7fb;--font-family-editor:\'Rubik\';--font-family-preview:\'Rubik\'}.theme-light{--background-primary:#ffffff;--background-primary-alt:#f5f5f5;--background-secondary:#f0f0f0;--background-secondary-alt:#e8e8e8;--text-normal:#1a1a1a;--text-accent:#0fb6d6;--text-sub-accent:#f4569d;--text-dim:#45aaff;--text-faint:#7aa2f7;--text-title-h1:var(--text-accent);--text-title-h2:#2d3a4a;--text-title-h3:#2d3a4a;--text-title-h4:#2d3a4a;--text-title-h5:#2d3a4a;--text-link:#555555;--text-a:#0fb6d6;--text-a-hover:#0fb6d6;--text-mark:#263d92;--code-background:var(--background-secondary);--interactive-accent:rgba(14, 210, 247, 0.3);--interactive-accent-hover:rgba(14, 210, 247, 0.6);--interactive-before:#cccccc;--blockquote-border:#4aa8fb;--tag-background:rgba(14, 210, 247, 0.1);--interactive-accent-rgb:#3dd7fb;--font-family-editor:\'Rubik\';--font-family-preview:\'Rubik\'}:root{--default-font:\'Rubik\',-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;--default-font-size:18px;--line-width:100%;--file-line-width:100%}body{font-family:\'Rubik\',\'Segoe UI\',Roboto,Arial,sans-serif;line-height:1.6;background:' + bgColor + ';color:' + textColor + '}</style>');
    win.document.write('</head><body class="' + themeClass + '" dir="rtl">');
    win.document.write('<div class="obsidian-document markdown-preview-view markdown-rendered is-readable-line-width">');
    win.document.write('<div class="markdown-preview-sizer markdown-preview-section">');
    win.document.write(allContent);
    win.document.write('</div></div>');
    win.document.write('<script>window.onload=function(){setTimeout(function(){window.print()},500)};window.onafterprint=function(){window.close()};<\/script>');
    win.document.write('</body></html>');
    win.document.close();
  };

})();
