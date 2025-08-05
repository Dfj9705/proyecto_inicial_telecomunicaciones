#include <WiFi.h>
#include <WiFiClientSecure.h>
#include "DHTesp.h"

const char* ssid = "Wokwi-GUEST";
const char* password = "";

const char* server = "apiclima.procodegt.com";
const int httpsPort = 443;

const int DHT_PIN = 25;
DHTesp dht;

WiFiClientSecure client;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  dht.setup(DHT_PIN, DHTesp::DHT22);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi conectado");
  client.setInsecure(); // ⚠️ Solo para pruebas: desactiva validación de certificado
}

void loop() {
  TempAndHumidity data = dht.getTempAndHumidity();
  String url = "/index.php?temp=" + String(data.temperature, 2) + "&hum=" + String(data.humidity, 2);

  Serial.println("Conectando a servidor HTTPS...");
  if (client.connect(server, httpsPort)) {
    Serial.println("Conectado. Enviando solicitud...");
    client.println("GET " + url + " HTTP/1.1");
    client.println("Host: " + String(server));
    client.println("User-Agent: ESP32");
    client.println("Connection: close");
    client.println();
    Serial.println("Enviado");
  } else {
    Serial.println("Error de conexión HTTPS");
  }

  delay(10000);
}
