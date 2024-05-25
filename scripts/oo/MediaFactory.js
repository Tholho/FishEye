import Video from "./Video";
import Photo from "./Photo";

export default class MediaFactory {
    constructor(data) {
        if ("video" in data) {
            return new Video(data);
        }
        else if ("image" in data) {
            return new Photo(data);
        }
        else {
            throw ("Erreur de type de fichier");
        }
    }
}