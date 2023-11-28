package com.sap.c4p.rm.consultantprofile.utils;

import org.apache.commons.io.output.ByteArrayOutputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

public class FileUtils {

    private static final Logger LOGGER = LoggerFactory.getLogger(FileUtils.class);

    private FileUtils() {
    }

    public static ByteArrayOutputStream compressUsingGzip(ByteArrayOutputStream outputStream) throws IOException {
        /* This is just a temporary buffer defined for helping in conversion of input stream to output stream.
         Buffer size provided is a random value.
        */
        byte[] buffer = new byte[Constants.DEFAULT_BUFFER_SIZE];
        GZIPOutputStream os = null;
        InputStream inputStream = null;
        try
        {
            ByteArrayOutputStream byteArray = new ByteArrayOutputStream();

            os = new GZIPOutputStream(byteArray){
                /* Levels range from -1(default) to 9(best).
                For our use-case, Level 2 offers the best trade-off between size reduction and time taken for compression.*/
                {
                    this.def.setLevel(2);
                }
            };

            inputStream = outputStream.toInputStream();

            int totalSize;
            while((totalSize = inputStream.read(buffer)) > 0 )
            {
                os.write(buffer, 0, totalSize);
            }
            inputStream.close();
            os.finish();
            os.close();

            return byteArray;
        }
        catch (Exception exception) {
            LOGGER.error("Error occurred while compression {}",exception.getMessage());
            assert inputStream != null;
            inputStream.close();
            os.finish();
            os.close();
        }
        return null;
    }

    public static ByteArrayOutputStream decompressUsingGzip(InputStream compressedInputStream)
    {
        byte[] buffer = new byte[Constants.DEFAULT_BUFFER_SIZE];
        try
        {
            GZIPInputStream is =
                new GZIPInputStream(compressedInputStream);

            ByteArrayOutputStream out = new ByteArrayOutputStream();

            int bytesRead;
            while(Constants.EOF != (bytesRead = is.read(buffer)))
            {
                out.write(buffer, 0, bytesRead);
            }

            out.close();
            is.close();
            return out;
        }
        catch (IOException e)
        {
            LOGGER.error("Exception happened when trying to decompress {}",e.getMessage());
        }
        return null;
    }

}
