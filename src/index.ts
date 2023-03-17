import app from './app'
import { initiateApp } from './app';

async function main() {
    await initiateApp();

    const port = 8000;
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server is running at port ${port}`);
    });

}
main().catch(err => console.log(err))