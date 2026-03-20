---
title: Composition & Layout Components Pattern
impact: HIGH
impactDescription: eliminates prop drilling, enables RSC/client component mixing, improves reusability
tags: pattern, composition, layout-components, prop-drilling, react-server-components, children, ReactNode
---

## Pattern: Composition & Layout Components Pattern

### The Core Idea

Instead of passing data props through intermediate components that don't use them (prop drilling), pass **React elements** as props. Intermediate components become **layout components** — they decide _where_ things go, not _what_ they are.

| Approach      | Intermediate component knows about data? | Reusable?                             | RSC-friendly?                                   |
| ------------- | ---------------------------------------- | ------------------------------------- | ----------------------------------------------- |
| Prop drilling | Yes — accepts and forwards props         | Limited — tied to specific data shape | No — forces client boundary up                  |
| Composition   | No — accepts `ReactNode`                 | High — any content fits               | Yes — server and client elements compose freely |

### The Pattern

**Before (prop drilling):**

```tsx
function App() {
  const [user] = useState({ name: "Kody", image: "/img/kody.png" });
  return <Nav user={user} />;
}

function Nav({ user }: { user: User }) {
  return (
    <nav>
      <a href="#/me">
        <img src={user.image} alt={`${user.name} profile`} />
      </a>
    </nav>
  );
}
```

**After (composition):**

```tsx
function App() {
  const [user] = useState({ name: "Kody", image: "/img/kody.png" });
  return <Nav avatar={<img src={user.image} alt={`${user.name} profile`} />} />;
}

function Nav({ avatar }: { avatar: React.ReactNode }) {
  return (
    <nav>
      <a href="#/me">{avatar}</a>
    </nav>
  );
}
```

`Nav` no longer knows about `User` — it just lays out whatever `avatar` it receives.

### Key Rules

1. **Layout components accept `React.ReactNode` props** — not data objects they don't use
2. **State stays where it's consumed** — the component that creates state renders the elements that need it, then passes those elements down
3. **Type narrowing with `Pick`** — if a component genuinely needs 1-2 fields from a large type, use `Pick<User, 'name'>` instead of the full type. But prefer `ReactNode` when the component is purely laying things out
4. **`React.ReactNode` includes arrays** — `listItems: React.ReactNode` works for both single elements and mapped arrays
5. **Don't over-compose** — if a component actually uses the data (not just forwarding it), keep it as a regular prop

### When to Use

- **Prop drilling** — an intermediate component accepts props only to pass them to children
- **Reusable layout shells** — headers, sidebars, card layouts, page templates where the content varies but the structure is shared
- **React Server Components** — a server component can render client elements as `ReactNode` props without forcing the entire subtree to be a client component
- **Customizable UI** — a shared component (hero, nav, footer) that needs different content per page

### When NOT to Use

- When the intermediate component actually uses the data — that's not prop drilling, that's normal
- When it creates more complexity than it saves — a two-level prop pass is often fine
- When you need the intermediate component to have control over rendering logic (conditionals, transforms) based on the data

### Example: Full Layout Composition

```tsx
function App() {
  const [user] = useState<User>({ name: "Kody", image: "/img/kody.png" });
  const [items] = useState<Array<Item>>(() => Object.values(allItems));
  const [selected, setSelected] = useState<Item | null>(null);

  return (
    <div id="app-root">
      <Nav avatar={<img src={user.image} alt={`${user.name} profile`} />} />
      <Main
        sidebar={
          <List
            listItems={items.map((item) => (
              <li key={item.id}>
                <ItemButton item={item} onClick={() => setSelected(item)} />
              </li>
            ))}
          />
        }
        content={<Details selected={selected} />}
      />
      <Footer
        message={`Don't have a good day–have a great day, ${user.name}`}
      />
    </div>
  );
}

function Nav({ avatar }: { avatar: React.ReactNode }) {
  return (
    <nav>
      <ul>
        <li>
          <a href="#/home">Home</a>
        </li>
        <li>
          <a href="#/about">About</a>
        </li>
      </ul>
      <a href="#/me" title="User Settings">
        {avatar}
      </a>
    </nav>
  );
}

function Main({
  sidebar,
  content,
}: {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <main>
      {sidebar}
      {content}
    </main>
  );
}

function List({ listItems }: { listItems: React.ReactNode }) {
  return (
    <div className="list">
      <ul>{listItems}</ul>
    </div>
  );
}

function Footer({ message }: { message: string }) {
  return (
    <footer>
      <p>{message}</p>
    </footer>
  );
}
```

All state management lives in `App`. Layout components (`Nav`, `Main`, `List`, `Footer`) only decide where content goes — they're trivially reusable and easy to type.

### Trade-offs

- **Readability at the call site** — deeply nested JSX in the parent can get verbose. Balance by not composing more than needed
- **Loss of encapsulation** — the parent now decides what to render, not the child. This is a feature when you want flexibility, but a cost when the child should enforce consistency
- **Typing becomes simpler** — `React.ReactNode` instead of specific data types, but you lose type-level documentation of what the component "means"

### Checklist

- [ ] Identified which components are just forwarding props they don't use
- [ ] Converted forwarded props to `React.ReactNode` slot props
- [ ] State and event handlers remain at the level that owns them
- [ ] Parent renders the elements that need data, passes them as `ReactNode`
- [ ] Didn't over-compose — kept data props where the component actually uses them
- [ ] Footer/simple text slots use `string` when `ReactNode` isn't needed

### Reference

- Source material: `materials/patterns/composition/`
- Blog post: [One React mistake that's slowing you down](https://epicreact.dev/one-react-mistake-thats-slowing-you-down)
- Blog post: [Prop Drilling](https://kentcdodds.com/blog/prop-drilling)
