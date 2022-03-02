package bit.project.server.util.helper;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;

public abstract class ImageHelper {
    public static BufferedImage resizeImage(BufferedImage originalImage, int targetWidth, int targetHeight) {
        BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics2D = resizedImage.createGraphics();
        graphics2D.drawImage(originalImage, 0, 0, targetWidth, targetHeight, null);
        graphics2D.dispose();
        return resizedImage;
    }
    public static BufferedImage resizeJPGImage(BufferedImage originalImage, int targetWidth, int targetHeight) {
        return resizeImage(originalImage, targetWidth, targetHeight);
    }

    public static BufferedImage resizePNGImage(BufferedImage originalImage, int targetWidth, int targetHeight) {
        BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_ARGB);
        Graphics2D graphics2D = resizedImage.createGraphics();
        graphics2D.drawImage(originalImage, 0, 0, targetWidth, targetHeight, null);
        graphics2D.dispose();
        return resizedImage;
    }

    public static byte[] resizeImage(byte[] imageInByte, int targetWidth, int targetHeight) throws IOException {
        InputStream in = new ByteArrayInputStream(imageInByte);
        BufferedImage bImageFromConvert = resizeImage(ImageIO.read(in), targetWidth, targetHeight);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(bImageFromConvert, "jpg", baos);
        baos.flush();
        byte[] outputArray = baos.toByteArray();
        baos.close();

        return outputArray;
    }

    public static byte[] resizePNGImage(byte[] imageInByte, int targetWidth, int targetHeight) throws IOException {
        InputStream in = new ByteArrayInputStream(imageInByte);
        BufferedImage bImageFromConvert = resizePNGImage(ImageIO.read(in), targetWidth, targetHeight);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(bImageFromConvert, "png", baos);
        baos.flush();
        byte[] outputArray = baos.toByteArray();
        baos.close();

        return outputArray;
    }

    public static byte[] resizeJPGImage(byte[] imageInByte, int targetWidth, int targetHeight) throws IOException {
        return resizeImage(imageInByte, targetWidth, targetHeight);
    }



}
