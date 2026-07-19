declare module "jspdf-autotable" {
  import { jsPDF } from "jspdf";

  interface UserOptions {
    head?: any[][];
    body?: any[][];
    foot?: any[][];
    startY?: number;
    theme?: "striped" | "grid" | "plain";
    styles?: Record<string, unknown>;
    headStyles?: Record<string, unknown>;
    bodyStyles?: Record<string, unknown>;
    columnStyles?: Record<string, unknown>;
    margin?: number | Record<string, number>;
  }

  export default function autoTable(
    doc: jsPDF,
    options: UserOptions
  ): void;
}