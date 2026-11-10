import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

// React's types don't list MathML tags; this lets JSX use the ones below.
type MathMLProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      math: MathMLProps & { display?: "block" | "inline" };
      mrow: MathMLProps;
      mi: MathMLProps;
      mn: MathMLProps;
      mo: MathMLProps;
      msub: MathMLProps;
      mfrac: MathMLProps;
      munder: MathMLProps;
      mtable: MathMLProps;
      mtr: MathMLProps;
      mtd: MathMLProps;
    }
  }
}

// Formulas are native MathML, which every current browser renders itself: no library, no CSS
// import and no injected HTML. The helpers below cover what the Learn pages need.

// A variable, with an optional subscript: <V n="d" sub="i" /> is d with a subscript i.
export function V({ n, sub }: { n: string; sub?: string }) {
  return sub ? (
    <msub>
      <mi>{n}</mi>
      <mi>{sub}</mi>
    </msub>
  ) : (
    <mi>{n}</mi>
  );
}

export function Frac({ num, den }: { num: ReactNode; den: ReactNode }) {
  return (
    <mfrac>
      <mrow>{num}</mrow>
      <mrow>{den}</mrow>
    </mfrac>
  );
}

// A sum over `index`, with the summed terms as children.
export function Sum({ index, children }: { index: string; children: ReactNode }) {
  return (
    <mrow>
      <munder>
        <mo>∑</mo>
        <mi>{index}</mi>
      </munder>
      {children}
    </mrow>
  );
}

// Equations aligned on the "=": each row is a [left side, right side] pair.
export function Equations({ rows }: { rows: [ReactNode, ReactNode][] }) {
  return (
    <mtable>
      {rows.map(([left, right], i) => (
        <mtr key={i}>
          <mtd style={{ textAlign: "right" }}>{left}</mtd>
          <mtd style={{ textAlign: "left" }}>
            <mo>=</mo>
            {right}
          </mtd>
        </mtr>
      ))}
    </mtable>
  );
}

// `display` sets the formula on its own line in a bordered box, with any children (a "where ..."
// clause) inside the same box; otherwise it flows inside the text.
export function Formula({
  math,
  display = false,
  children,
}: {
  math: ReactNode;
  display?: boolean;
  children?: ReactNode;
}) {
  if (!display) return <math>{math}</math>;
  return (
    <div className="overflow-x-auto rounded-lg border border-containers-divider bg-canvas-bgScales px-normal">
      <math display="block">{math}</math>
      {children && <div className="pb-normal text-sm">{children}</div>}
    </div>
  );
}
