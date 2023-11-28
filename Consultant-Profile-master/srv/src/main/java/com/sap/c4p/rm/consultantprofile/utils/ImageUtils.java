package com.sap.c4p.rm.consultantprofile.utils;

import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.Transparency;
import java.awt.image.BufferedImage;

public class ImageUtils {
    /**
     * Utility class for all the image related changes
     */

    private ImageUtils() {
    }

    public static BufferedImage getScaledInstance(BufferedImage img, int targetWidth, int targetHeight) {
        int type = (img.getTransparency() == Transparency.OPAQUE) ? BufferedImage.TYPE_INT_RGB
                : BufferedImage.TYPE_INT_ARGB;
        BufferedImage result = img;
        int w = img.getWidth();
        int h = img.getHeight();
        do {
            if (w > targetWidth) {
                w /= 2;
                if (w < targetWidth) {
                    w = targetWidth;
                }
            }
            if (h > targetHeight) {
                h /= 2;
                if (h < targetHeight) {
                    h = targetHeight;
                }
            }
            BufferedImage temp = new BufferedImage(w, h, type);
            Graphics2D g2 = temp.createGraphics();
            g2.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
            g2.drawImage(result, 0, 0, w, h, null);
            g2.dispose();
            result = temp;
        } while (w != targetWidth || h != targetHeight);
        return result;
    }

    public static BufferedImage getScaledProfilePhoto(BufferedImage img) {
        float w = img.getWidth();
        float h = img.getHeight();
        int targetWidth = 0;
        int targetHeight = 0;
        float ratio = w / h;
        if (ratio >= 1) {
            targetHeight = Constants.HEIGHT_PROFILE;
            targetWidth = Math.round(targetHeight * ratio);
        } else {
            targetWidth = Constants.WIDTH_PROFILE;
            targetHeight = Math.round(targetWidth / ratio);
        }
        return getScaledInstance(img, targetWidth, targetHeight);
    }

    public static BufferedImage getScaledThumbnail(BufferedImage img) {
        float w = img.getWidth();
        float h = img.getHeight();
        int targetWidth = 0;
        int targetHeight = 0;
        float ratio = w / h;
        if (ratio >= 1) {
            targetHeight = Constants.HEIGHT_THUMBNAIL;
            targetWidth = Math.round(targetHeight * ratio);
        } else {
            targetWidth = Constants.WIDTH_THUMBNAIL;
            targetHeight = Math.round(targetWidth / ratio);
        }
        return getScaledInstance(img, targetWidth, targetHeight);
    }
}
