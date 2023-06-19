package nipun.appium;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;

import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;

import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import io.appium.java_client.service.local.AppiumDriverLocalService;
import io.appium.java_client.service.local.AppiumServiceBuilder;

public class Properties{
	String store = "Dominos";
	String appLocation = "C://Users//nipun//eclipse-workspace//appium//src//test//java//resources//dominos.apk";
	String deviceName = "Pixel 6 Pro API 33";
	String npmLocation = "C:\\Users\\nipun\\AppData\\Roaming\\npm\\node_modules\\appium\\build\\lib\\main.js";
	
	public AndroidDriver driver;
	public AppiumDriverLocalService service;
	
	public void ConfigureAppium() throws MalformedURLException {
		service = new AppiumServiceBuilder().withAppiumJS(new File(npmLocation)).withIPAddress("127.0.0.1").usingPort(4723).build();
		service.start();
		UiAutomator2Options options = new UiAutomator2Options();
		options.setDeviceName(deviceName);
		options.setAutoGrantPermissions(true);
		options.setApp(appLocation);
		driver = new AndroidDriver(new URL("http://127.0.0.1:4723"), options);
		driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(20));
	}
	
	public void tearDown() {
		driver.quit();
		service.stop();
	}
}
