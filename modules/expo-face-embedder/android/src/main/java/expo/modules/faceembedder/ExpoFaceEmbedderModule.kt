package expo.modules.faceembedder

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Log
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import org.tensorflow.lite.Interpreter
import java.io.FileInputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.MappedByteBuffer
import java.nio.channels.FileChannel
import android.content.res.AssetFileDescriptor
import java.io.File

class ExpoFaceEmbedderModule : Module() {

    // TensorFlow Lite interpreter instance
    private var interpreter: Interpreter? = null

    override fun definition() = ModuleDefinition {
        Name("ExpoFaceEmbedder")

        // -------------------
        // Log image URI
        // -------------------
        AsyncFunction("logImageUriAsync") { imageUri: String, promise: Promise ->
            try {
                Log.d("ExpoFaceEmbedder", "Received image URI from JS: $imageUri")
                promise.resolve("✅ URI logged successfully!")
            } catch (e: Exception) {
                promise.reject("ERR_LOG_URI", e.message, e)
            }
        }

        // -------------------
        // Load TFLite model from assets
        // -------------------
        AsyncFunction("loadModelAsync") { promise: Promise ->
            try {
                val assetManager = appContext.reactContext?.assets
                    ?: throw Exception("React context not available")

                val assetFd: AssetFileDescriptor = assetManager.openFd("face_embedding_model.tflite")
                val fileInputStream = FileInputStream(assetFd.fileDescriptor)
                val fileChannel = fileInputStream.channel
                val mappedBuffer: MappedByteBuffer = fileChannel.map(
                    FileChannel.MapMode.READ_ONLY,
                    assetFd.startOffset,
                    assetFd.declaredLength
                )

                interpreter = Interpreter(mappedBuffer)
                promise.resolve("✅ Interpreter initialized successfully!")
            } catch (e: Exception) {
                promise.reject("ERR_MODEL_INIT", e.message, e)
            }
        }

        // -------------------
        // Get image embedding
        // -------------------
        AsyncFunction("getImageEmbeddingAsync") { imagePath: String, promise: Promise ->
            try {
                if (interpreter == null) throw Exception("Interpreter not initialized")

                // Load bitmap from file path
                val bitmap = loadBitmapFromFile(imagePath)
                Log.d("ExpoFaceEmbedder", "Bitmap loaded successfully from path: $imagePath")

                // Resize bitmap and prepare ByteBuffer
                val resizedBitmap = resizeBitmapForModel(bitmap)
                val inputBuffer = bitmapToByteBuffer(resizedBitmap)
                Log.d("ExpoFaceEmbedder", "Input ByteBuffer prepared with capacity: ${inputBuffer.capacity()}")

                // Prepare output buffer: assuming model outputs 192-d embedding vector
                val embedding = Array(1) { FloatArray(128) }

                // Run inference
                interpreter!!.run(inputBuffer, embedding)
                Log.d("ExpoFaceEmbedder", "Embedding generated successfully!")

                // Convert to JS-friendly array
                promise.resolve(embedding[0].toList())
            } catch (e: Exception) {
                promise.reject("ERR_INFERENCE", e.message, e)
            }
        }
    }

    // -------------------
    // Private helper: load bitmap from file path
    // -------------------
    private fun loadBitmapFromFile(imagePath: String): Bitmap {
        val file = File(imagePath)
        if (!file.exists()) throw Exception("File does not exist: $imagePath")

        return BitmapFactory.decodeFile(file.absolutePath)
            ?: throw Exception("Failed to decode bitmap")
    }

    // -------------------
    // Private helper: Resize bitmap to model input size (112x112)
    // -------------------
    private fun resizeBitmapForModel(bitmap: Bitmap, width: Int = 112, height: Int = 112): Bitmap {
        return Bitmap.createScaledBitmap(bitmap, width, height, true)
    }

    // -------------------
    // Private helper: Convert Bitmap to ByteBuffer
    // -------------------
    private fun bitmapToByteBuffer(bitmap: Bitmap): ByteBuffer {
        val inputWidth = 112
        val inputHeight = 112
        val inputChannels = 3

        val resizedBitmap = Bitmap.createScaledBitmap(bitmap, inputWidth, inputHeight, true)
        val byteBuffer = ByteBuffer.allocateDirect(1 * inputWidth * inputHeight * inputChannels * 4)
        byteBuffer.order(ByteOrder.nativeOrder())

        for (y in 0 until inputHeight) {
            for (x in 0 until inputWidth) {
                val pixel = resizedBitmap.getPixel(x, y)
                val r = ((pixel shr 16) and 0xFF) / 255.0f
                val g = ((pixel shr 8) and 0xFF) / 255.0f
                val b = (pixel and 0xFF) / 255.0f

                byteBuffer.putFloat(r)
                byteBuffer.putFloat(g)
                byteBuffer.putFloat(b)
            }
        }

        byteBuffer.rewind()
        return byteBuffer
    }
}
