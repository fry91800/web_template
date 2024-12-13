type queryString = "insert" | "update" | "delete"
type Query = 
  | { type: queryString; table: string; data: any };