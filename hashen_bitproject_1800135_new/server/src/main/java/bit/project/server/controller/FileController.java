package bit.project.server.controller;

import bit.project.server.dao.FileDao;
import bit.project.server.entity.File;
import bit.project.server.util.exception.ObjectNotFoundException;
import bit.project.server.util.helper.FileHelper;
import bit.project.server.util.helper.ImageHelper;
import javassist.tools.web.BadHttpRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin
// @Configuration
@RestController
// @EnableScheduling
@RequestMapping("/files")
public class FileController {

    @Autowired
    FileDao fileDao;

    Logger logger = LoggerFactory.getLogger(FileController.class);

    @GetMapping("/thumbnail/{fileId}")
    public ResponseEntity<byte[]> getThumbnail(@PathVariable String fileId){
        Optional<File> optionalFile = fileDao.findThumbnailById(fileId);
        if(optionalFile.isEmpty()) throw new ObjectNotFoundException("File not found");
        File file = optionalFile.get();
        return FileHelper.byteArrayToResponseEntity(file.getThumbnail(), file.getThumbnailmimetype());

    }

    @GetMapping("/details/{fileId}")
    public File getBasicDetails(@PathVariable String fileId){
        Optional<File> optionalFile = fileDao.findFileDetailsById(fileId);
        if(optionalFile.isEmpty()) throw new ObjectNotFoundException("File not found");
        return optionalFile.get();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public HashMap<String, String> add(@RequestParam("file") MultipartFile multipartFile) throws IOException, BadHttpRequest {

        byte[] fileBytes = multipartFile.getBytes();
        String mimetype = multipartFile.getContentType();

        if (mimetype == null || fileBytes == null) throw  new BadHttpRequest();

        mimetype = mimetype.toLowerCase();

        HashMap<String, String> data = new HashMap<>();

        byte[] thumbnail;
        String thumnailMimetype;
        String thumbnailLocation = "src/main/resources/thumbnails/";

        if(mimetype.equals("image/jpg") || mimetype.equals("image/jpeg")){
            thumbnail = ImageHelper.resizeJPGImage(fileBytes, 128, 128);
            thumnailMimetype = "image/jpeg";
        }else if(mimetype.equals("image/png")){
            thumbnail = ImageHelper.resizePNGImage(fileBytes, 128, 128);
            thumnailMimetype = "image/png";
        }else if(mimetype.equals("image/svg+xml")){
            thumbnail = fileBytes;
            thumnailMimetype = "image/svg+xml";
        }else{

            switch (mimetype){
                case "application/pdf" :
                    thumbnail = thumbnailFileProvider(thumbnailLocation+ "pdf.svg");
                    thumnailMimetype= "image/svg+xml";
                    break;
                case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" :
                case "application/vnd.ms-excel" :
                    thumbnail = thumbnailFileProvider(thumbnailLocation+ "xls.svg");
                    thumnailMimetype= "image/svg+xml";
                    break;
                case "application/vnd.openxmlformats-officedocument.presentationml.presentation" :
                    thumbnail = thumbnailFileProvider(thumbnailLocation+ "ppt.svg");
                    thumnailMimetype= "image/svg+xml";
                    break;
                case "application/vnd.openxmlformats-officedocument.wordprocessingml.document" :
                case "application/msword" :
                    thumbnail = thumbnailFileProvider(thumbnailLocation+ "doc.svg");
                    thumnailMimetype= "image/svg+xml";
                    break;
                default:
                    thumbnail = thumbnailFileProvider(thumbnailLocation+ "file.svg");
                    thumnailMimetype="image/svg+xml";
            }

        }

        File f = new File();
        f.setId(UUID.randomUUID().toString());
        f.setFilemimetype(mimetype);
        f.setFile(fileBytes);
        f.setFilesize(multipartFile.getSize());
        f.setThumbnail(thumbnail);
        f.setThumbnailmimetype(thumnailMimetype);
        f.setOriginalname(multipartFile.getOriginalFilename());
        f.setIsused(false);
        f.setTocreation(LocalDateTime.now());

        fileDao.save(f);

        data.put("id", f.getId());
        return data;
    }

    public static byte[] thumbnailFileProvider(String filePath) throws IOException {
        return Files.readAllBytes(Paths.get(filePath));
    }

    /*@Async
    @Scheduled(fixedRate = 2*60*60*1000, initialDelay = 5000)
    public void scheduleFixedRateTaskAsync() throws InterruptedException {
        fileDao.deleteUnusedFilesByDateBefore(LocalDateTime.now().minusHours(1));
        logger.info("Delete unused files");
    }*/

}
    
