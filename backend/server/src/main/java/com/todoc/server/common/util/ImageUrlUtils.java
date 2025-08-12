package com.todoc.server.common.util;

public class ImageUrlUtils {

    public static String getImageUrl(Long imageFileId) {
        return "/api/images/" + imageFileId + "/presigned";
    }
}
