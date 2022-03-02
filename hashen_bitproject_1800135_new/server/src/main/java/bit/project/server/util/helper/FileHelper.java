package bit.project.server.util.helper;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.Base64;

public abstract class FileHelper {
    public static ResponseEntity<byte[]> byteArrayToResponseEntity(byte[] data, String mimetype) {
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.valueOf(mimetype)).body(data);
    }

    public static String byteArrayToBase64(byte[] data, String mimetype){
        byte[] encoded = Base64.getEncoder().encode(data);
        String base64 = new String(encoded);
        return  "data:"+mimetype+";base64,"+base64;
    }
}
