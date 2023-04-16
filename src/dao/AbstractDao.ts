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
                    data: this.fsReadFileSync(imageName),
                    contentType: 'image/jpg'
                }
                this.removeImageFromStorage(imageName)
                return img
            } catch (err) {
                console.log('Image saving process has failed' + err);
                throw err
            }
        }
        return {
            data: [],
            contentType: ''}
    }
    fsReadFileSync(imageName: string): Buffer {
        return fs.readFileSync(`${process.cwd()}/images/` + imageName)
    }
    removeImageFromStorage(imageName: string): void {
        fs.unlink(`${process.cwd()}/images/` + imageName, (err) => {
            if (err) {
                console.log('Failed to delete image file' + err);
                throw err
            }
            console.log('Image file was deleted successfully');
        })
    }
}


