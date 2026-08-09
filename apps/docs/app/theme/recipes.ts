export const cssRecipe = `.sh-theme {
  --sh-class: #8d85ff;
  --sh-identifier: #354150;
  --sh-sign: #8996a3;
  --sh-property: #4e8fdf;
  --sh-entity: #6eafad;
  --sh-jsxliterals: #bf7db6;
  --sh-string: #00a99a;
  --sh-keyword: #f47067;
  --sh-comment: #a19595;
}

.sh-theme .sh__token--keyword,
.sh-theme .sh__token--class {
  font-weight: 600;
}

.sh-theme .sh__token--comment {
  font-style: italic;
}`

export const tailwindRecipe = `@import 'tailwindcss';

@layer components {
  .sh-theme {
    --sh-class: var(--color-violet-500);
    --sh-identifier: var(--color-slate-700);
    --sh-sign: var(--color-slate-400);
    --sh-property: var(--color-blue-500);
    --sh-entity: var(--color-teal-500);
    --sh-jsxliterals: var(--color-fuchsia-400);
    --sh-string: var(--color-emerald-600);
    --sh-keyword: var(--color-rose-400);
    --sh-comment: var(--color-stone-400);
  }

  .sh-theme .sh__token--keyword,
  .sh-theme .sh__token--class {
    @apply font-semibold;
  }

  .sh-theme .sh__token--comment {
    @apply italic opacity-80;
  }
}`
