export function filterTools(tools, query, filter = 'all') {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return tools
    .filter(tool => {
      const text = [tool.title, tool.subtitle, tool.category, tool.repo, ...(tool.tags || [])].join(' ').toLocaleLowerCase();
      return (filter === 'all' || tool.type === filter) && terms.every(term => text.includes(term));
    })
    .sort((a, b) => {
      const pA = typeof a.priority === 'number' ? a.priority : Infinity;
      const pB = typeof b.priority === 'number' ? b.priority : Infinity;
      return pA - pB;
    });
}
