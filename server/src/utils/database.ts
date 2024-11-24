import sequelize from '../database/database';
import { Database, DatabaseConfig, TableInfo } from '../interfaces/database.interface';  // Import the interfaces

export async function getTablesInfo() {
    const tables: TableInfo[] = []
    for (const modelName of Object.keys(sequelize.models)) {
        const model = sequelize.models[modelName];
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
        tables.push({
            tableName: modelName.toLowerCase(),
            columns: columns,
            data: data
        });
    }
    return tables
}