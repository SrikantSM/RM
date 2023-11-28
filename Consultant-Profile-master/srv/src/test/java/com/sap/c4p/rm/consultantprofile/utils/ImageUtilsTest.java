package com.sap.c4p.rm.consultantprofile.utils;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.math.BigInteger;
import java.util.Arrays;

import javax.imageio.ImageIO;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class ImageUtilsTest {

    @Test
    @DisplayName("Test get compressed profile photo where height of the image is more")
    public void getScaledProfilePhoto() throws IOException {
        BufferedImage bufferedImage = ImageIO.read(new File("src/test/resources/testImages/profile.jpg"));
        BufferedImage compressedImage = ImageUtils.getScaledProfilePhoto(bufferedImage);
        assertEquals(113, compressedImage.getHeight());
        assertEquals(112, compressedImage.getWidth());
    }

    @Test
    @DisplayName("Test get compressed thumbnail photo where height of the image is more")
    public void getScaledThumbNailPhoto() throws IOException {
        BufferedImage bufferedImage = ImageIO.read(new File("src/test/resources/testImages/profile.jpg"));
        BufferedImage compressedImage = ImageUtils.getScaledThumbnail(bufferedImage);
        assertEquals(48, compressedImage.getHeight());
        assertEquals(48, compressedImage.getWidth());
    }

    @Test
    @DisplayName("Test get compressed profile photo where width of the image is more")
    public void getScaledProfilePhoto2() throws IOException {
        BufferedImage bufferedImage = ImageIO.read(new File("src/test/resources/testImages/profile.png"));
        BufferedImage compressedImage = ImageUtils.getScaledProfilePhoto(bufferedImage);
        assertEquals(112, compressedImage.getHeight());
        assertEquals(112, compressedImage.getWidth());
    }

    @Test
    @DisplayName("Test get compressed thumbnail photo where width of the image is more")
    public void getScaledThumbNailPhoto2() throws IOException {
        BufferedImage bufferedImage = ImageIO.read(new File("src/test/resources/testImages/profile.png"));
        BufferedImage compressedImage = ImageUtils.getScaledThumbnail(bufferedImage);
        assertEquals(48, compressedImage.getHeight());
        assertEquals(48, compressedImage.getWidth());
    }

    public static byte[] fromHexString(String src) {
        byte[] biBytes = new BigInteger("10" + src.replaceAll("\\s", ""), 16).toByteArray();
        return Arrays.copyOfRange(biBytes, 1, biBytes.length);
    }
}
