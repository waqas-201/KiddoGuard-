import android.graphics.Bitmap
import android.graphics.ImageDecoder
import android.net.Uri
import android.os.Build
import android.content.ContentResolver

fun uriToBitmap(contentResolver: ContentResolver, uri: Uri): Bitmap {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        // Use ImageDecoder on Android 9+ (API 28+)
        val source = ImageDecoder.createSource(contentResolver, uri)
        ImageDecoder.decodeBitmap(source)
    } else {
        // Fallback for older versions
        @Suppress("DEPRECATION")
        android.provider.MediaStore.Images.Media.getBitmap(contentResolver, uri)
    }
}
