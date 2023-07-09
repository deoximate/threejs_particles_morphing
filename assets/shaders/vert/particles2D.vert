#define PI 3.1415926


uniform sampler2D tDepthTop;


uniform float uTime;
uniform float uDate;
uniform vec4 uMousePos;
uniform vec3 uViewPos;

uniform float uInstanceCount;

out float vInstanceID;
out vec3 vPos;
out float vDepth;
out vec3 vNormal;
out float vIsDrop;
out float vIsVisible;


float rand (in vec2 st) {
    return fract(sin(dot(st.xy,
    vec2(12.9898,78.233)))
    * 43758.5453123);
}

vec3 randomOnSphere(in vec2 st) {
  vec3 randN = vec3(rand(st), rand(st), rand(st)); 
  float theta = randN.x * 2.0 * 3.14159265;
  float v = randN.y;

  float phi = acos(2.0 * v - 1.0);
  float r = pow(randN.z, 1.0 / 3.0);
  float x = r * sin(phi) * cos(theta);
  float y = r * sin(phi) * sin(theta);
  float z = r * cos(phi);

  return vec3(x, y, z);
}

float cnoise (vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float surface3 ( vec3 coord ) {
        float frequency = 4.0;
        float n = 0.0;  
        n += 1.0    * abs( cnoise( vec2(coord * frequency) ) );
        n += 0.5    * abs( cnoise( vec2(coord * frequency * 2.0) ) );
        n += 0.25   * abs( cnoise( vec2(coord * frequency * 4.0) ) );
        return n;
}

float normalizeRange (float value, float minValue, float maxValue) {
  return ((value - minValue) / (maxValue - minValue))*2.0-0.5;
}

vec3 generateNormal(sampler2D tex, vec2 texCoord, vec2 texelSize) {
    vec3 dx = vec3(texelSize.x, 0.0, texture(tex, texCoord + vec2(texelSize.x, 0.0)).r - texture(tex, texCoord - vec2(texelSize.x, 0.0)).r);
    vec3 dy = vec3(0.0, texelSize.y, texture(tex, texCoord + vec2(0.0, texelSize.y)).r - texture(tex, texCoord - vec2(0.0, texelSize.y)).r);
    return normalize(cross(dy, -dx));
}



void main() {
  float count = 10.0;
  float idx = float(gl_InstanceID);
  float x = mod(idx, count);
  float z = floor(idx / count);
  float y = mod(idx, 2.0);

  vec2 size = vec2(0.01)*(100.0/count)*16.0;


  //! POSITION
  vec3 pos = vec3(x, y, -1.0);
  pos.x = rand(vec2(x+sin(idx), y-cos(idx)))*5.0-2.5;
  pos.y = rand(vec2(x+sin(idx), y+cos(idx)))*5.0-2.5;
  pos.xy *= size;


  gl_PointSize = floor(rand(vec2(idx))*15.0+10.0);
  vIsVisible = 1.0;
  


  float t = uTime*0.05;
  pos.xy += vec2(
    sin(t+idx),
    cos(t+idx-sin(t+idx))
  )*1.0;





  //! UV ^ MAPS
  vec2 depthUV = pos.xz/1.3+0.5;
  depthUV.y = 1.0-depthUV.y;
  vec2 depthTexelSize = (1.0/vec2(textureSize(tDepthTop, 0)));
  float depth = (1.0-texture(tDepthTop, depthUV).r);





  vec4 modelViewPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;





  vInstanceID = idx;
  vPos = pos;
}