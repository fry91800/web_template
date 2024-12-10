type Query = 
  | { type: 'insert'; table: string; data: any }
  | { type: 'update'; table: string; where: any; data: any }
  | { type: 'delete'; table: string; where: any};