import app from './app'
import { initiateApp } from './app';

async function main() {
    await initiateApp();

    const port = process.env.PORT || 8000;
    app.listen(port, () => {
        console.log(`Server is running at port ${port}`);
    });

}
main().catch(err => console.log(err))