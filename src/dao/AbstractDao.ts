import  fs  from "fs";
export abstract class AbstractDao {
    dateValidator(date?: string | null) {
        if (date) {return date}
        const newDate = new Date(); 
        const options = {day: '2-digit', month: '2-digit', year: 'numeric' }as const;
        const dateString = newDate.toLocaleDateString('en-US', options);
        return dateString;
    }
    deicideImage(imageName: string) {
        if (imageName) {
            try {
                const img = {
                    data: fs.readFileSync(`${process.cwd()}/images/` + imageName),
                    contentType: 'image/jpg'
                }
                fs.unlink(`${process.cwd()}/images/` + imageName, (err) => {
                    console.log('Image file deletion has failed' + err);
                })
                return img
            } catch (err) {
                console.log('Image saving process has failed' + err);
            }
        }
        return {
            data: [],
            contentType: ''}
    }
}


