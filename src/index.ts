import app from './app'
import { initiateApp } from './app';

async function main() {
    await initiateApp();

    const port = process.env.PORT || 3333;
    app.listen(port, () => {
        console.log(`Server is up and running at port ${port}`);
    });

}
main().catch(err => console.log(err))