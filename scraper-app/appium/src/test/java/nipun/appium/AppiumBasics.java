package nipun.appium;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpHeaders;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import org.testng.annotations.Test;
import com.google.gson.Gson;
import io.appium.java_client.AppiumBy;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.util.ArrayList;
import java.util.Arrays;

public class AppiumBasics extends Properties {
	
	public static List<String> getCitiesFromAPI() throws Exception {
        // Create an instance of HttpClient
        HttpClient httpClient = HttpClient.newBuilder().build();

        // Define the API URL
        URI uri = URI.create("https://api-sugarwallet.onrender.com/app/cities");

        // Create a GET request
        HttpRequest request = HttpRequest.newBuilder()
                .uri(uri)
                .GET()
                .build();

        // Send the request and get the response
        HttpResponse<String> response = httpClient.send(request, BodyHandlers.ofString());

        // Get the response status code
        int statusCode = response.statusCode();
        System.out.println("Response Code: " + statusCode);

        // Get the response headers
        HttpHeaders headers = response.headers();
        System.out.println("Response Headers: " + headers);

        // Get the response body
        String responseBody = response.body();
        System.out.println("Response Body: " + responseBody);

        // Parse the JSON response
        Gson gson = new Gson();
        List<String> cities = Arrays.asList(gson.fromJson(responseBody, String[].class));

        return cities;
    }
	
	public static void sendData(String location, String storeName, Map<String,String> map) throws IOException{
		try {
			HttpClient httpClient = HttpClient.newBuilder().build();

            // Define the API URL
            URI uri = URI.create("https://api-sugarwallet.onrender.com/app/data");

            // Create a Map for the JSON payload
            Map<String, Object> payload = new HashMap<>();
            payload.put("storeName", storeName);
            payload.put("location", location);

            List<Map<String, Object>> offers = new ArrayList<>();

    		for(Map.Entry m : map.entrySet()){  
    			Map<String, Object> offer1 = new HashMap<>();
                offer1.put("detail", m.getValue());
                offer1.put("promo", m.getKey());
                offers.add(offer1);
    		}  
            payload.put("offers", offers);

            // Convert the Map to a JSON string
            Gson gson = new Gson();
            String jsonPayload = gson.toJson(payload);

            // Create a POST request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(uri)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .header("Content-Type", "application/json")
                    .build();

            // Send the request and get the response
            HttpResponse<String> response = httpClient.send(request, BodyHandlers.ofString());
            int statusCode = response.statusCode();
            String responseBody = response.body();
            System.out.println("Response Code: " + statusCode);
            System.out.println("Response Body: " + responseBody);
        } catch (Exception e) {
            e.printStackTrace();
        }
	} 
		
	
	@Test
	public void AppiumTest() throws Exception {
		List<String> cities = getCitiesFromAPI();
		for (String city : cities) {
			ConfigureAppium();
			driver.findElement(AppiumBy.id("com.Dominos:id/skip_login")).click();
			driver.findElement(AppiumBy.id("com.Dominos:id/tv_change_location_btn")).click();
			driver.findElement(AppiumBy.id("com.Dominos:id/etSearchLocation")).sendKeys(city);
			driver.findElement(AppiumBy.xpath("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.RelativeLayout/android.widget.LinearLayout/android.widget.ListView/android.widget.RelativeLayout[1]/android.widget.LinearLayout[2]")).click();	
			Thread.sleep(3000);
			driver.findElement(AppiumBy.id("com.Dominos:id/tv_confirm_btn")).click();
			driver.findElement(AppiumBy.xpath("(/hierarchy/android.widget.FrameLayout/android.widget.RelativeLayout/android.widget.ImageView)")).click();
			driver.findElement(AppiumBy.id("com.Dominos:id/ivProfile")).click();
			driver.findElement(AppiumBy.xpath("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/androidx.drawerlayout.widget.DrawerLayout/android.widget.RelativeLayout/androidx.recyclerview.widget.RecyclerView/android.widget.RelativeLayout[2]/android.widget.RelativeLayout")).click();
		
			int offerTile = driver.findElements(AppiumBy.id("com.Dominos:id/rl_main")).size();
			Map<String,String> map=new HashMap<String,String>();  
			for(int i=0; i < offerTile-1; i++) {
				if(driver.findElements(AppiumBy.id("com.Dominos:id/tv_coupon_code")).size() == 0 ||
						driver.findElements(AppiumBy.id("com.Dominos:id/tv_coupon_desc")).size() == 0) {continue;};
				String code = driver.findElements(AppiumBy.id("com.Dominos:id/tv_coupon_code")).get(i).getText();
				String desc = driver.findElements(AppiumBy.id("com.Dominos:id/tv_coupon_desc")).get(i).getText();
				map.put(code, desc);
			}
			
			driver.findElements(AppiumBy.androidUIAutomator("new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text(\"Payment Offers\"));"));
			Thread.sleep(1100);
			
			offerTile = driver.findElements(AppiumBy.id("com.Dominos:id/tv_coupon_code")).size();
			for(int i=0; i<offerTile; i++) {
				String code = driver.findElements(AppiumBy.id("com.Dominos:id/tv_coupon_code")).get(i).getText();
				String desc = driver.findElements(AppiumBy.id("com.Dominos:id/tv_coupon_desc")).get(i).getText();
				map.put(code, desc);
			}
			
			offerTile = driver.findElements(AppiumBy.id("com.Dominos:id/tv_coupon_discount_sec")).size();
			for(int i=0; i<offerTile; i++) {
				String desc = driver.findElements(AppiumBy.id("com.Dominos:id/tv_coupon_discount_sec")).get(i).getText();
				map.put("No Coupoun", desc);
			}
			
			offerTile = driver.findElements(AppiumBy.id("com.Dominos:id/tv_coupon_discount")).size();
			for(int i=0; i<offerTile; i++) {
				String desc = driver.findElements(AppiumBy.id("com.Dominos:id/tv_coupon_discount")).get(i).getText();
				map.put("No Coupoun", desc);
			}
			
			for(Map.Entry m:map.entrySet()){  
				   System.out.println(m.getKey()+" "+m.getValue());  
			}  
			
			sendData(city, store, map);
			System.out.println("\nData sended to server\n");
			tearDown();
        }
	}
	
}
