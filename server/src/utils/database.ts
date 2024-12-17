import sequelize from '../database/database';
import { Database, DatabaseConfig, TableInfo } from '../interfaces/database.interface';  // Import the interfaces
import {Failure} from '../types/failure'

export async function getTablesInfo() {
    const tables: TableInfo[] = []
    for (const modelName of Object.keys(sequelize.models)) {
        const table = await getTableInfo(modelName)
        tables.push(table)
    }
    return tables
}

export async function getTableInfo(tableName: string) {
    const tables: TableInfo[] = []
        const model = sequelize.models[tableName];
        if (!model){
            throw new Failure(400, 'Table not found', { "table": "Table not found"});
        }
        // Step 1: Fetch columns name and type
        const columns = await model.describe()
            .then(data => {
                const res = []
                for (const [key, value] of Object.entries(data)) {
                    res.push({
                        name: key,
                        type: value.type
                    })
                }
                return res
            })
        // Step 2: Fetch table data
        const data = await model.findAll();
        // Step 3: Build the array
        return {
            //TODO: Clarify that this is not the tablename but the model name
            tableName: tableName,
            columns: columns,
            data: data
        };
}