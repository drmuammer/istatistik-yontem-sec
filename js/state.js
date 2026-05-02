export function createState(tree) {
  let path = ['root'];
  const subs = new Set();
  const publish = () => { for (const cb of subs) cb([...path]); };

  function findPathTo(targetId) {
    const queue = [{ id: 'root', trail: ['root'] }];
    const seen = new Set();
    while (queue.length) {
      const { id, trail } = queue.shift();
      if (id === targetId) return trail;
      if (seen.has(id)) continue;
      seen.add(id);
      const node = tree[id];
      if (!node || node.leaf) continue;
      for (const opt of node.options) queue.push({ id: opt.next, trail: [...trail, opt.next] });
    }
    throw new Error(`Yol bulunamadı: ${targetId}`);
  }

  return {
    getPath: () => [...path],
    getCurrentNode: () => tree[path[path.length - 1]],
    isLeaf() { return Boolean(this.getCurrentNode()?.leaf); },
    select(nextId) {
      const cur = tree[path[path.length - 1]];
      if (!cur || cur.leaf) throw new Error('Leaf\'ten ilerlenemez');
      if (!cur.options?.some(o => o.next === nextId)) throw new Error(`Geçersiz seçim: ${nextId}`);
      path.push(nextId); publish();
    },
    back() { if (path.length > 1) { path.pop(); publish(); } },
    reset() { path = ['root']; publish(); },
    jumpTo(nodeId) { path = findPathTo(nodeId); publish(); },
    subscribe(cb) { subs.add(cb); return () => subs.delete(cb); },
  };
}
