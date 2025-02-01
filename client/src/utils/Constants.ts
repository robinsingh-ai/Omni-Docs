import { DataSource } from "../redux/reducers/dataSlice";

export default class Constants {

    static readonly items: Record<string, DataSource> = {
        'Crust Data': 'crust_data',
        'Next.js': 'nextjs',
        'Flutter': 'flutter',
    };
}