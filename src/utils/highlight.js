//  高亮传入节点中匹配正则表达式的文本
export function highlight(node, pattern) {
  const stack = [node];
  while (stack.length > 0) {
    const currNode = stack.pop();
    if (currNode.nodeType === 3) {
      let parent = currNode.parentNode;
      let text = currNode.nodeValue;
      let matched = null;
      let nextNode = currNode;
      let offset = 0;
      while ((matched = pattern.exec(text)) != null) {
        let splited = nextNode.splitText(matched.index - offset);
        nextNode = splited.splitText(matched[0].length);
        offset = matched.index + matched[0].length;
        const el = document.createElement("span");
        el.dataset.mark = "highlight";
        var hlTextNode = document.createTextNode(splited.nodeValue);
        el.appendChild(hlTextNode);
        parent.replaceChild(el, splited);
      }
    } else if (currNode.nodeType === 1) {
      // 容器节点
      currNode.childNodes.forEach((node) => {
        stack.push(node);
      });
    }
  }
}

// 移除高亮
export function removeHighlight(node) {
  const nodes = document.querySelectorAll('[data-mark="highlight"]');
  nodes.forEach((node) => {
    const parent = node.parentNode;
    parent.replaceChild(document.createTextNode(node.innerText), node);
    parent.normalize();
  });
}