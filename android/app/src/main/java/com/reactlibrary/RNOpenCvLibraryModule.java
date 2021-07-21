package com.reactlibrary;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.util.Log;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.logging.Logger;
import org.opencv.android.Utils;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.Size;
import org.opencv.imgproc.Imgproc;
import org.opencv.core.MatOfPoint;
import org.opencv.core.Point;
import org.opencv.core.Scalar;
import org.opencv.core.TermCriteria;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.BiFunction;
import java.util.logging.Logger;


import com.facebook.react.bridge.Callback;

import android.app.ProgressDialog;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import org.opencv.core.Core;
import org.opencv.core.Rect;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.android.Utils;
import org.opencv.core.MatOfPoint;
import org.opencv.core.Scalar;
import org.opencv.core.TermCriteria;
import org.opencv.imgproc.Imgproc;

import android.os.AsyncTask;
import android.util.Base64;
import android.util.Log;
import android.widget.Toast;

import org.opencv.core.Size;
import org.opencv.utils.Converters;

import java.io.ByteArrayOutputStream;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.util.Log;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.FileOutputStream;
import org.opencv.android.Utils;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.Size;
import org.opencv.imgproc.Imgproc;

import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;
import org.opencv.imgcodecs.Imgcodecs;




public class RNOpenCvLibraryModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext reactContext;
  private String TAG="APP";

  public RNOpenCvLibraryModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNOpenCvLibrary";
  }

  @ReactMethod
  public void checkForBlurryImage(
    String imageAsBase64,
    Callback errorCallback,
    Callback successCallback
  ) {

    try {
      BitmapFactory.Options options = new BitmapFactory.Options();
      options.inDither = true;
      options.inPreferredConfig = Bitmap.Config.ARGB_8888;

      byte[] decodedString = Base64.decode(imageAsBase64, Base64.DEFAULT);
      Bitmap image = BitmapFactory.decodeByteArray(
        decodedString,
        0,
        decodedString.length
      );

      //      Bitmap image = decodeSampledBitmapFromFile(imageurl, 2000, 2000);
      int l = CvType.CV_8UC1; //8-bit grey scale image
      Mat matImage = new Mat();
      Utils.bitmapToMat(image, matImage);
      Mat matImageGrey = new Mat();
      Imgproc.cvtColor(matImage, matImageGrey, Imgproc.COLOR_BGR2GRAY);

      Bitmap destImage;
      destImage = Bitmap.createBitmap(image);
      Mat dst2 = new Mat();
      Utils.bitmapToMat(destImage, dst2);
      Mat laplacianImage = new Mat();
      dst2.convertTo(laplacianImage, l);
      Imgproc.Laplacian(matImageGrey, laplacianImage, CvType.CV_8U);
      Mat laplacianImage8bit = new Mat();
      laplacianImage.convertTo(laplacianImage8bit, l);

      Bitmap bmp = Bitmap.createBitmap(
        laplacianImage8bit.cols(),
        laplacianImage8bit.rows(),
        Bitmap.Config.ARGB_8888
      );
      Utils.matToBitmap(laplacianImage8bit, bmp);
      int[] pixels = new int[bmp.getHeight() * bmp.getWidth()];
      bmp.getPixels(
        pixels,
        0,
        bmp.getWidth(),
        0,
        0,
        bmp.getWidth(),
        bmp.getHeight()
      );
      int maxLap = -16777216; // 16m
      for (int pixel : pixels) {
        if (pixel > maxLap) maxLap = pixel;
      }

      int soglia = -6118750;
      // int soglia = -8118750;
      if (maxLap <= soglia) {
        System.out.println("is blur image");
      }

      successCallback.invoke(maxLap <= soglia);
    } catch (Exception e) {
      errorCallback.invoke(e.getMessage());
    }
  }
  public int safeLongToInt(long l) {
    if (l < Integer.MIN_VALUE || l > Integer.MAX_VALUE) {
        throw new IllegalArgumentException
            (l + " cannot be cast to int without changing its value.");
    }
    return (int) l;
}
    @ReactMethod
    public void meanBlurMethod(String imageAsBase64, Callback errorCallback,
    Callback successCallback){
     Log.d(TAG,imageAsBase64);
    Log.d(TAG,"OpenCv MBM Line 111");
        //ImageView ivImage, ivImageProcessed;
        Mat src=new Mat();
        System.out.println("Entering java func");
        int DELAY_CAPTION = 1500;
        int DELAY_BLUR = 100;
        int MAX_KERNEL_LENGTH = 31;
        
        //ImageView ivImage, ivImageProcessed;
          Mat dst;
  
        try{
          Log.d(TAG,"136");
          BitmapFactory.Options options = new BitmapFactory.Options();
        options.inDither = true;
        options.inPreferredConfig = Bitmap.Config.ARGB_8888;
        // byte[] decoded = Base64.getDecoder().decode(imageAsBase64);
          
        byte[] decodedString = Base64.decode(imageAsBase64, Base64.DEFAULT);
        // Mat mat = Imgcodecs.imdecode(new MatOfByte(decodedString), Imgcodecs.CV_LOAD_IMAGE_UNCHANGED);
        // Mat mat = new Mat(width, height, CvType.CV_8UC3);
        // mat.put(0, 0, decodedString);
        Bitmap image = BitmapFactory.decodeByteArray(decodedString,0,decodedString.length);
       
        Utils.bitmapToMat(image, src);
        
        dst = new Mat(src.rows(), src.cols(), src.type());
        
        Imgproc.GaussianBlur(src, dst, new Size(15,15), 0);
  
        //Applying GaussianBlur on the Image
        // for (int i = 1; i < MAX_KERNEL_LENGTH; i = i + 2) {
          
        // }
  
  
        Bitmap finalImage = Bitmap.createBitmap(dst.cols(),
        dst.rows(), Bitmap.Config.RGB_565);
        Utils.matToBitmap(dst, finalImage);
        Bitmap bitmap = (Bitmap) finalImage;
        bitmap = Bitmap.createScaledBitmap(bitmap, 600, 450, false);

  
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
        byte[] byteArray = byteArrayOutputStream.toByteArray();
        String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
        
        
        //byte[] img = dst.data().get(byte[].class);
        Log.d(TAG,encoded.toString());
        Log.d(TAG,"str"+encoded);
        successCallback.invoke(encoded);
  
        }catch(Exception e){
          Log.e(TAG,"error "+e.getStackTrace());
            errorCallback.invoke(e.getStackTrace().toString());
        }
    }

    @ReactMethod
    public void addContrastMethod(String imageAsBase64, int alpha ,Callback errorCallback,
    Callback successCallback){
    Log.d(TAG,"OpenCv MBM Line 111");
        //ImageView ivImage, ivImageProcessed;
        Mat src=new Mat();
        System.out.println("Entering java func");
        int beta = 0;
        
        //ImageView ivImage, ivImageProcessed;
          Mat dst;
  
        try{
          BitmapFactory.Options options = new BitmapFactory.Options();
        options.inDither = true;
        options.inPreferredConfig = Bitmap.Config.ARGB_8888;

          
        byte[] decodedString = Base64.decode(imageAsBase64, Base64.DEFAULT);

        Bitmap image = BitmapFactory.decodeByteArray(decodedString,0,decodedString.length);
       
        Utils.bitmapToMat(image, src);
        
        dst = new Mat(src.rows(), src.cols(), src.type());

        //increase contrast
        src.convertTo(dst, -1, alpha, beta);

        Bitmap finalContrastImage = Bitmap.createBitmap(dst.cols(),
        dst.rows(), Bitmap.Config.ARGB_8888);

        Utils.matToBitmap(dst, finalContrastImage);
        Bitmap bitmap = (Bitmap) finalContrastImage;
        bitmap = Bitmap.createScaledBitmap(bitmap, 600, 450, false);

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
        byte[] byteArray = byteArrayOutputStream.toByteArray();
        String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
        
        
        //byte[] img = dst.data().get(byte[].class);
        successCallback.invoke(encoded);
  
        }catch(Exception e){
          Log.e(TAG,"error "+e.getStackTrace());
            errorCallback.invoke(e.getStackTrace().toString());
        }
    }


    //border detection

    @ReactMethod
    public void borderDetection(String imageAsBase64, Callback errorCallback, Callback successCallback) throws ExecutionException, InterruptedException {
  
  
        Mat src = new Mat();
        Mat srcOrig;
        Integer scaleFactor;
  
        try {
            BitmapFactory.Options options = new BitmapFactory.Options();
            options.inDither = true;
            options.inPreferredConfig = Bitmap.Config.ARGB_8888;
  
            byte[] decodedString = Base64.decode(imageAsBase64, Base64.DEFAULT);
            Log.d(TAG,"LINE 195 :" + decodedString.toString());
  
            Bitmap selectedImage = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
            Log.d(TAG,"LINE 198 :");
            srcOrig = new Mat(selectedImage.getHeight(), selectedImage.getWidth(), CvType.CV_8UC4);
            Utils.bitmapToMat(selectedImage, srcOrig);
            Log.d(TAG,"LINE 201 :");
            scaleFactor = calcScaleFactor(srcOrig.rows(), srcOrig.cols());
            Log.d(TAG,"LINE 203 :");
            Imgproc.resize(srcOrig, src, new Size(srcOrig.rows() / scaleFactor, srcOrig.cols() / scaleFactor));
            Log.d(TAG,"LINE 205 :");
            Bitmap resultDocument = getPage(src, srcOrig, scaleFactor);
            Log.d(TAG,"LINE 207 :");
            
            
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            resultDocument.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
            byte[] byteArray = byteArrayOutputStream.toByteArray();

            String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
        
            //byte[] img = dst.data().get(byte[].class);
            Log.d(TAG,"LINE 211 :");
            successCallback.invoke(encoded);
            // successCallback.invoke(byteArray);
  
        }catch (Exception e){
            Log.e(TAG," STACK TRACE :"+e.getStackTrace().toString());
        }
  
    }
  
    private Bitmap getPage(Mat src, Mat srcOrig, Integer scaleFactor)  {
  
        Bitmap result;
  
        // THIS return new AsyncTask<Void, Void, Bitmap>() {
           
  
  
  
           // THIS @Override
           // THIS protected Bitmap doInBackground(Void... params) {


                Mat srcRes = new Mat( src.size(), src.type() );
                Mat srcGray = new Mat();
  
                Log.d(TAG,"LINE 292 :");
                Mat samples = new Mat(src.rows() * src.cols(), 3, CvType.CV_32F);
                for( int y = 0; y < src.rows(); y++ ) {
                    for( int x = 0; x < src.cols(); x++ ) {
                        for( int z = 0; z < 3; z++) {
                            samples.put(x + y*src.cols(), z, src.get(y,x)[z]);
                        }
                    }
                }
                Log.d(TAG,"LINE 301 :");
  
                int clusterCount = 2;
                Mat labels = new Mat();
                int attempts = 5;
                Mat centers = new Mat();
                Log.d(TAG,"LINE 307 :");
                Core.kmeans(samples, clusterCount, labels, new TermCriteria(TermCriteria.MAX_ITER | TermCriteria.EPS, 10000, 0.0001), attempts, Core.KMEANS_PP_CENTERS, centers);
                Log.d(TAG,"LINE 309 : KMEANS"+centers.get(0, 0)[0]+centers.get(0, 1)[0]+centers.get(0, 2)[0] +" CENTRE2:"+centers.get(1, 0)[0]+centers.get(1, 1)[0]+centers.get(1, 2)[0]);
                
                
                double dstCenter0 = calcWhiteDist(centers.get(0, 0)[0], centers.get(0, 1)[0], centers.get(0, 2)[0]);
                Log.d(TAG,"LINE 313 : CENTRE0 :"+dstCenter0);
                double dstCenter1 = calcWhiteDist(centers.get(1, 0)[0], centers.get(1, 1)[0], centers.get(1, 2)[0]);
                Log.d(TAG,"LINE 315 : CENTRE1 :"+dstCenter1);
                
                int paperCluster = (dstCenter0 < dstCenter1)?0:1;
  //
  //                double[] black = {0, 0, 0};
  //                double[] white = {255, 255, 255};
  
                Log.d(TAG,"LINE 322 :");
                for( int y = 0; y < src.rows(); y++ ) {
                    for( int x = 0; x < src.cols(); x++ )
                    {
                        int cluster_idx = (int)labels.get(x + y*src.cols(),0)[0];
                        
                        if(cluster_idx != paperCluster){
                            srcRes.put(y,x, 0, 0, 0, 255);
                        } else {
                            srcRes.put(y,x, 255, 255, 255, 255);
                        }
                    }
                }
                Log.d(TAG,"LINE 334 :");

  
                // Imgproc.medianBlur(srcRes, srcRes, 5);
  
  //                Mat kernel = Imgproc.getStructuringElement(Imgproc.CV_SHAPE_RECT, new Size(10, 10));
  
  //                // Opening to remove small noise pixels
  //                Imgproc.erode(srcRes, srcRes, kernel);
  //                Imgproc.dilate(srcRes, srcRes, kernel);
  //
  //                // Closing to fill in gaps
  //                Imgproc.dilate(srcRes, srcRes, kernel);
  //                Imgproc.erode(srcRes, srcRes, kernel);
  
  
                // TODO Potential error in opencv
                Imgproc.cvtColor(srcRes, srcGray, Imgproc.COLOR_BGR2GRAY);

                ////////////// UPGRADE ADDED BY US /////////////////
                int kernelSize = 3;
                Mat element = Imgproc.getStructuringElement(Imgproc.CV_SHAPE_RECT, new Size(2 * kernelSize + 1, 2 * kernelSize + 1), new Point(kernelSize, kernelSize));
                Imgproc.erode(srcGray, srcGray, element);
                Imgproc.dilate(srcGray, srcGray, element);
                
                for(int i = 1 ; i<=3 ;i++)
                  Imgproc.erode(srcGray, srcGray, element);
            
                for(int i = 1; i <= 3; i++)
                  Imgproc.dilate(srcGray, srcGray, element);

                //POssible increase in future for i values
                for(int i = 1; i <= 2; i++)
                  Imgproc.erode(srcGray, srcGray, element);

                for(int i = 1; i <= 2; i++)
                  Imgproc.dilate(srcGray, srcGray, element);

                ///////////////////////////////////////////////////////////////////////////
                // Bitmap finalImage = Bitmap.createBitmap(srcRes.cols(),srcRes.rows(), Bitmap.Config.ARGB_8888);
                // Utils.matToBitmap(srcGray, finalImage);
                // return finalImage;
                /////////////////////////////////////////////////////////////////////////////


                Log.d(TAG,"LINE 351 :");
                Imgproc.Canny(srcGray, srcGray, 50, 150);

                // Imgproc.putText(
                //   srcRes,                          // Matrix obj of the image
                //   "Ravivarma's Painting",          // Text to be added
                //   new Point(10, 50),               // point
                //   Imgproc.FONT_HERSHEY_SIMPLEX ,      // front face
                //   1,                               // front scale
                //   new Scalar(255, 255, 255),             // Scalar object for color
                //   4                                // Thickness
                // );
                
                
                // int kernelSize = 3;
                // Mat element = Imgproc.getStructuringElement(Imgproc.CV_SHAPE_RECT, new Size(2 * kernelSize + 1, 2 * kernelSize + 1), new Point(kernelSize, kernelSize));

                // Imgproc.dilate(srcGray, srcGray, element);

                Log.d(TAG,"LINE 353 :");
                //Utils.matToBitmap(srcGray, finalImage);
                Log.d(TAG,"LINE 469 : COUNTOURS");

                List<MatOfPoint> contours = new ArrayList<MatOfPoint>();
                Mat hierarchy = new Mat();
  
                Log.d(TAG,"LINE 358 :");
                Imgproc.findContours(srcGray, contours, hierarchy, Imgproc.RETR_TREE, Imgproc.CHAIN_APPROX_SIMPLE);
              
                
                Log.d(TAG,"LINE 360 : CONTOURS : "+ contours);
                
                
                int index = 0;
                Log.d(TAG,"LINE 362 :");
                double maxim = Imgproc.contourArea(contours.get(0));
                Log.d(TAG,"LINE 364 :");
                for (int contourIdx = 1; contourIdx < contours.size(); contourIdx++) {
                    double temp;
                    temp=Imgproc.contourArea(contours.get(contourIdx));
                    if(maxim<temp)
                    {
                        maxim=temp;
                        index=contourIdx;
                    }
                }
                Log.d(TAG,"LINE 374 : MAXIM : " + maxim);
              
                    MatOfPoint contour = contours.get(index);
                    Rect rect = Imgproc.boundingRect(contour);
                    Imgproc.rectangle(src, rect.tl(), rect.br(), new Scalar(255, 255, 0), 1);
                 
               
  
                // Mat drawing = Mat.zeros(srcRes.size(), CvType.CV_8UC1);
                // Log.d(TAG,"LINE 377 :");
                // Imgproc.drawContours(drawing, contours, index, new Scalar(255), 1);
                // Log.d(TAG,"LINE 379 :");
                // Mat lines = new Mat();

                Mat image_roi = new Mat(original_image, rect);


                //////////////////////// ////////////////////////////////
                Bitmap finalImage = Bitmap.createBitmap(srcRes.cols(), srcRes.rows(), Bitmap.Config.ARGB_8888);
                Utils.matToBitmap(src, finalImage);
                return finalImage;
                //////////////////////// //////////////////////////////////
                
                // Imgproc.HoughLinesP(drawing, lines, 1, Math.PI/180, 70, 30, 10);
                // String dump = lines.dump();
                // Log.d(TAG,"LINE 382 : LINES : "+dump);
  //               ArrayList<org.opencv.core.Point> corners = new ArrayList<org.opencv.core.Point>();

  //               for (int i = 0; i < lines.cols(); i++)
  //               {
  //                   for (int j = i+1; j < lines.cols(); j++) {
  //                       double[] line1 = lines.get(0, i);
  //                       double[] line2 = lines.get(0, j);
  
  //                       org.opencv.core.Point pt = findIntersection(line1, line2);
  //                       Log.d(TAG, "x " + pt.x+" "+"y "+pt.y);
  //                       if (pt.x >= 0 && pt.y >= 0 && pt.x <= drawing.cols() && pt.y <= drawing.rows()){
  //                           if(!exists(corners, pt)){
  //                               corners.add(pt);
  //                           }
  //                       }
  //                   }
  //               }
  //               Log.d(TAG,"LINE 399 :"+corners.size());
  
  //               if(corners.size() != 4){
  //                   String errorMsg =  "Cannot detect perfect corners";
  //                   Bitmap bitmap = Bitmap.createBitmap(drawing.cols(), drawing.rows(), Bitmap.Config.ARGB_8888);
  //                   Utils.matToBitmap(drawing, bitmap);
  
  //                   return bitmap;
  
  // //                    return null;
  //               }
  //               Log.d(TAG,"LINE 411 :");
  
  //               sortCorners(corners,scaleFactor);
  //               Log.d(TAG,"LINE 414 :");
  //               if(corners.size() == 0){
  //                   String err = "Cannot sort corners";
  //                   return null;
  //               }
  //               Log.d(TAG,"LINE 419 :");
  //               double top = Math.sqrt(Math.pow(corners.get(0).x - corners.get(1).x, 2) + Math.pow(corners.get(0).y - corners.get(1).y, 2));
  //               double right = Math.sqrt(Math.pow(corners.get(1).x - corners.get(2).x, 2) + Math.pow(corners.get(1).y - corners.get(2).y, 2));
  //               double bottom = Math.sqrt(Math.pow(corners.get(2).x - corners.get(3).x, 2) + Math.pow(corners.get(2).y - corners.get(3).y, 2));
  //               double left = Math.sqrt(Math.pow(corners.get(3).x - corners.get(1).x, 2) + Math.pow(corners.get(3).y - corners.get(1).y, 2));
  //               Log.d(TAG,"LINE 424 :");
  //               Mat quad = Mat.zeros(new Size(Math.max(top, bottom), Math.max(left, right)), CvType.CV_8UC3);
  //               Log.d(TAG,"LINE 426 :");
  //               ArrayList<org.opencv.core.Point> result_pts = new ArrayList<org.opencv.core.Point>();
  //               result_pts.add(new Point(0, 0));
  //               result_pts.add(new Point(quad.cols(), 0));
  //               result_pts.add(new Point(quad.cols(), quad.rows()));
  //               result_pts.add(new Point(0, quad.rows()));
  //               Log.d(TAG,"LINE 432 :");
  
  //               Mat cornerPts = Converters.vector_Point2f_to_Mat(corners);
  //               Mat resultPts = Converters.vector_Point2f_to_Mat(result_pts);
  //               Log.d(TAG,"LINE 436 :");
  //               Log.d("com.packtpub.chapter10", cornerPts.checkVector(2, CvType.CV_32F)+" "+resultPts.checkVector(2, CvType.CV_32F)+" "+CvType.CV_32F+" "+cornerPts.type());
  
  //               Mat transformation = Imgproc.getPerspectiveTransform(cornerPts, resultPts);
  //               Imgproc.warpPerspective(srcOrig, quad, transformation, quad.size());
  //               Log.d(TAG,"LINE 441 :");
  //               Bitmap bitmap = Bitmap.createBitmap(quad.cols(), quad.rows(), Bitmap.Config.ARGB_8888);
  //               Utils.matToBitmap(quad, bitmap);
  //               Log.d(TAG,"LINE 444 :");
  //               return bitmap;      ///////////////////// THIS PART IS THE REAL CODE ////////////////////
            
            
            
            
            
            // THIS }
  
  //            @Override
  //            protected void onPostExecute(Bitmap bitmap) {
  //                super.onPostExecute(bitmap);
  //                dialog.dismiss();
  //                if(bitmap!=null) {
  //                    ivImage.setImageBitmap(bitmap);
  //                } else if (errorMsg != null){
  //                    Toast.makeText(getApplicationContext(), errorMsg, Toast.LENGTH_SHORT).show();
  //                }
  //            }
        //}.execute().get();
    }
  
  
    static double calcWhiteDist(double r, double g, double b){
        return Math.sqrt(Math.pow(255 - r, 2) + Math.pow(255 - g, 2) + Math.pow(255 - b, 2));
    }
  
    static org.opencv.core.Point findIntersection(double[] line1, double[] line2) {
        double start_x1 = line1[0], start_y1 = line1[1], end_x1 = line1[2], end_y1 = line1[3], start_x2 = line2[0], start_y2 = line2[1], end_x2 = line2[2], end_y2 = line2[3];
        double denominator = ((start_x1 - end_x1) * (start_y2 - end_y2)) - ((start_y1 - end_y1) * (start_x2 - end_x2));
  
        if (denominator!=0)
        {
          org.opencv.core.Point pt = new Point();
            pt.x = ((start_x1 * end_y1 - start_y1 * end_x1) * (start_x2 - end_x2) - (start_x1 - end_x1) * (start_x2 * end_y2 - start_y2 * end_x2)) / denominator;
            pt.y = ((start_x1 * end_y1 - start_y1 * end_x1) * (start_y2 - end_y2) - (start_y1 - end_y1) * (start_x2 * end_y2 - start_y2 * end_x2)) / denominator;
            return pt;
        }
        else
            return new Point(-1, -1);
    }
  
    static boolean exists(ArrayList<org.opencv.core.Point> corners, org.opencv.core.Point pt){
        for(int i=0; i<corners.size(); i++){
            if(Math.sqrt(Math.pow(corners.get(i).x-pt.x, 2)+Math.pow(corners.get(i).y-pt.y, 2)) < 10){
                return true;
            }
        }
        return false;
    }
  
    static void sortCorners(ArrayList<org.opencv.core.Point> corners, Integer scaleFactor)
    {
        ArrayList<org.opencv.core.Point> top, bottom;
  
        top = new ArrayList<org.opencv.core.Point>();
        bottom = new ArrayList<org.opencv.core.Point>();
  
        org.opencv.core.Point center = new org.opencv.core.Point();
  
        for(int i=0; i<corners.size(); i++){
            center.x += corners.get(i).x/corners.size();
            center.y += corners.get(i).y/corners.size();
        }
  
        for (int i = 0; i < corners.size(); i++)
        {
            if (corners.get(i).y < center.y)
                top.add(corners.get(i));
            else
                bottom.add(corners.get(i));
        }
        corners.clear();
  
        if (top.size() == 2 && bottom.size() == 2){
          org.opencv.core.Point top_left = top.get(0).x > top.get(1).x ? top.get(1) : top.get(0);
          org.opencv.core.Point top_right = top.get(0).x > top.get(1).x ? top.get(0) : top.get(1);
          org.opencv.core.Point bottom_left = bottom.get(0).x > bottom.get(1).x ? bottom.get(1) : bottom.get(0);
          org.opencv.core.Point bottom_right = bottom.get(0).x > bottom.get(1).x ? bottom.get(0) : bottom.get(1);
  
            top_left.x *= scaleFactor;
            top_left.y *= scaleFactor;
  
            top_right.x *= scaleFactor;
            top_right.y *= scaleFactor;
  
            bottom_left.x *= scaleFactor;
            bottom_left.y *= scaleFactor;
  
            bottom_right.x *= scaleFactor;
            bottom_right.y *= scaleFactor;
  
            corners.add(top_left);
            corners.add(top_right);
            corners.add(bottom_right);
            corners.add(bottom_left);
        }
    }
  
  
    public Integer calcScaleFactor(int rows, int cols){
        int idealRow, idealCol;
            if(rows<cols){
        idealRow = 240;
        idealCol = 320;
        } else {
        idealCol = 240;
        idealRow = 320;
        }
        int val = Math.min(rows / idealRow, cols / idealCol);
        if(val<=0){
        return 1;
        } else {
        return val;
        }
    }


  }


