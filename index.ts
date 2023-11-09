
import koffi from 'koffi';

// #region enums
enum CorsairDataType { // contains list of available property types
	CT_Boolean = 0,          // for property of type Boolean
	CT_Int32 = 1,            // for property of type Int32 or Enumeration
	CT_Float64 = 2,          // for property of type Float64
	CT_String = 3,           // for property of type String
	CT_Boolean_Array = 16,   // for array of Boolean
	CT_Int32_Array = 17,     // for array of Int32
	CT_Float64_Array = 18,   // for array of Float64
	CT_String_Array = 19     // for array of String
}

enum CorsairDevicePropertyId { // contains list of properties identifiers which can be read from device
	CDPI_Invalid = 0,                     // dummy value
	CDPI_PropertyArray = 1,               // array of CorsairDevicePropertyId members supported by device
	CDPI_MicEnabled = 2,                  // indicates Mic state (On or Off); used for headset, headset stand
	CDPI_SurroundSoundEnabled = 3,        // indicates Surround Sound state (On or Off); used for headset, headset stand
	CDPI_SidetoneEnabled = 4,             // indicates Sidetone state (On or Off); used for headset (where applicable)
	CDPI_EqualizerPreset = 5,             // the number of active equalizer preset (integer, 1 - 5); used for headset, headset stand
	CDPI_PhysicalLayout = 6,              // keyboard physical layout (see CorsairPhysicalLayout for valid values); used for keyboard
	CDPI_LogicalLayout = 7,               // keyboard logical layout (see CorsairLogicalLayout for valid values); used for keyboard
	CDPI_MacroKeyArray = 8,               // array of programmable G, M or S keys on device
	CDPI_BatteryLevel = 9,                // battery level (0 - 100); used for wireless devices
	CDPI_ChannelLedCount = 10,            // total number of LEDs connected to the channel
	CDPI_ChannelDeviceCount = 11,         // number of LED-devices (fans, strips, etc.) connected to the channel which is controlled by the DIY device
	CDPI_ChannelDeviceLedCountArray = 12, // array of integers, each element describes the number of LEDs controlled by the channel device
	CDPI_ChannelDeviceTypeArray = 13      // array of CorsairChannelDeviceType members, each element describes the type of the channel device
};

enum CorsairError // contains shared list of all errors which could happen during calling of Corsair* functions
{
	CE_Success = 0,               // if previously called function completed successfully
	CE_NotConnected = 1,          // if iCUE is not running or was shut down or third-party control is disabled in iCUE settings (runtime error), or if developer did not call CorsairConnect after calling CorsairDisconnect or on app start (developer error)
	CE_NoControl = 2,             // if some other client has or took over exclusive control (runtime error)
	CE_IncompatibleProtocol = 3,  // if developer is calling the function that is not supported by the server (either because protocol has broken by server or client or because the function is new and server is too old. Check CorsairSessionDetails for details) (developer error)
	CE_InvalidArguments = 4,      // if developer supplied invalid arguments to the function (for specifics look at function descriptions) (developer error)
	CE_InvalidOperation = 5,      // if developer is calling the function that is not allowed due to current state (reading improper properties from device, or setting callback when it has already been set) (developer error)
	CE_DeviceNotFound = 6,        // if invalid device id has been supplied as an argument to the function (when device id refers to disconnected device) (runtime error)
	CE_NotAllowed = 7             // if specific functionality (key interception) is disabled in iCUE settings (runtime error)
};

enum CorsairSessionState // contains a list of all possible session states
{
	CSS_Invalid = 0,              // dummy value
	CSS_Closed = 1,               // client not initialized or client closed connection (initial state)
	CSS_Connecting = 2,           // client initiated connection but not connected yet
	CSS_Timeout = 3,              // server did not respond, sdk will try again
	CSS_ConnectionRefused = 4,    // server did not allow connection
	CSS_ConnectionLost = 5,       // server closed connection
	CSS_Connected = 6             // successfully connected
}

enum CorsairDeviceType { // contains list of available device types
	CDT_Unknown = 0x0000,           // for unknown/invalid devices
	CDT_Keyboard = 0x0001,          // for keyboards
	CDT_Mouse = 0x0002,             // for mice
	CDT_Mousemat = 0x0004,          // for mousemats
	CDT_Headset = 0x0008,           // for headsets
	CDT_HeadsetStand = 0x0010,      // for headset stands
	CDT_FanLedController = 0x0020,  // for DIY-devices like Commander PRO
	CDT_LedController = 0x0040,     // for DIY-devices like Lighting Node PRO
	CDT_MemoryModule = 0x0080,      // for memory modules
	CDT_Cooler = 0x0100,            // for coolers
	CDT_Motherboard = 0x0200,       // for motherboards
	CDT_GraphicsCard = 0x0400,      // for graphics cards
	CDT_Touchbar = 0x0800,          // for touchbars
	CDT_All = 0xFFFFFFFF            // for all devices
};
// #endregion

// #region constants
const CORSAIR_STRING_SIZE_M = 128;
const CORSAIR_DEVICE_COUNT_MAX = 64;     // maximum number of devices to be discovered
// #endregion

// #region types, structures, unions
const CorsairDeviceId = koffi.array('char', CORSAIR_STRING_SIZE_M)

const CorsairDeviceFilter = koffi.struct('CorsairDeviceFilter', {
	deviceTypeMask: 'int',
});
type CorsairDeviceFilterStruct = {
	deviceTypeMask: number;
}

const CorsairDeviceInfo = koffi.struct('CorsairDeviceInfo', { // contains information about device
	type: 'int',                // enum describing device type
	id: CorsairDeviceId,                    // null terminated Unicode string that contains unique device identifier
	serial: CorsairDeviceId,    // null terminated Unicode string that contains device serial number. Can be empty, if serial number is not available for the device
	model: CorsairDeviceId,     // null terminated Unicode string that contains device model (like “K95RGB”)
	ledCount: 'int',                          // number of controllable LEDs on the device
	channelCount: 'int',                      // number of channels controlled by the device
});
type CorsairDeviceInfoStruct = {
	type: number,
	id: string,
	serial: string,
	model: string,
	ledCount: number,
	channelCount: number,
}

const CorsairVersion = koffi.struct('CorsairVersion', { // contains information about version that consists of three components
	major: 'int',
	minor: 'int',
	patch: 'int',
});

const CorsairSessionDetails = koffi.struct('CorsairSessionDetails', { // contains information about SDK and iCUE versions
	clientVersion: CorsairVersion,       // version of SDK client (like {4,0,1}). Always contains valid value even if there was no iCUE found. Must comply with the semantic versioning rules.
	serverVersion: CorsairVersion,       // version of SDK server (like {4,0,1}) or empty struct ({0,0,0}) if the iCUE was not found. Must comply with the semantic versioning rules.
	serverHostVersion: CorsairVersion,   // version of iCUE (like {3,33,100}) or empty struct ({0,0,0}) if the iCUE was not found.
});

const CorsairSessionStateChanged = koffi.struct('CorsairSessionStateChanged', { // contains information about session state and client/server versions
	state: 'int',     // new session state which SDK client has been transitioned to
	details: CorsairSessionDetails,   // information about client/server versions
});

const CorsairDataType_BooleanArray = koffi.struct('CorsairDataType_BooleanArray', { // represents an array of boolean values
	items: 'bool *',          // an array of boolean values
	count: 'unsigned int',   // number of items array elements
});

const CorsairDataType_Int32Array = koffi.struct('CorsairDataType_Int32Array', { // represents an array of integer values
	items: 'int *',           // an array of integer values
	count: 'unsigned int',   // number of items array elements
});

const CorsairDataType_Float64Array = koffi.struct('CorsairDataType_Float64Array', { // represents an array of double values
	items: 'double *',        // an array of double values
	count: 'unsigned int',   // number of items array elements
});

const CorsairDataType_StringArray = koffi.struct('CorsairDataType_StringArray', { // represents an array of pointers to null terminated strings
	items: 'char **',         // an array of pointers to null terminated strings
	count: 'unsigned int',   // number of items array elements
});

const CorsairDataValue = koffi.union('CorsairDataValue', { // a union of all property data types
	boolean: 'bool',                                // actual property value if it’s type is CPDT_Boolean
	int32: 'int',                                   // actual property value if it’s type is CPDT_Int32
	float64: 'double',                              // actual property value if it’s type is CPDT_Float64
	string: 'char*',                                // actual property value if it’s type is CPDT_String
	boolean_array: CorsairDataType_BooleanArray,  // actual property value if it’s type is CPDT_Boolean_Array
	int32_array: CorsairDataType_Int32Array,      // actual property value if it’s type is CPDT_Int32_Array
	float64_array: CorsairDataType_Float64Array,  // actual property value if it’s type is CPDT_Float64_Array
	string_array: CorsairDataType_StringArray,    // actual property value if it’s type is CPDT_String_Array
});

const CorsairProperty = koffi.struct('CorsairProperty', { // contains information about device property type and value
	type: 'int',   // type of property
	value: CorsairDataValue,  // property value
});
// #endregion

const CorsairSessionStateChangedHandler = koffi.proto('CorsairSessionStateChangedHandler', 'void', [
	koffi.pointer('void'), koffi.pointer(CorsairSessionStateChanged)
]);

// Load the shared library
const lib = koffi.load('lib/iCUESDK.x64_2019.dll');

// #region functions
const CorsairConnect = lib.stdcall('CorsairConnect', 'int', [
	koffi.pointer(CorsairSessionStateChangedHandler),  koffi.pointer('void')
]) as (callBack: koffi.IKoffiRegisteredCallback, context: undefined) => CorsairError;

const CorsairGetDevices = lib.stdcall('CorsairGetDevices', 'int', [
	koffi.pointer(CorsairDeviceFilter), 'int', koffi.out(koffi.pointer(CorsairDeviceInfo)), koffi.out(koffi.pointer('int'))
]) as (filter: CorsairDeviceFilterStruct, sizeMax: number, devices: CorsairDeviceInfoStruct[], size: number[]) => CorsairError;

const CorsairReadDeviceProperty = lib.stdcall('CorsairReadDeviceProperty', 'int', [
	'string', 'int', 'unsigned int', koffi.out(koffi.pointer(CorsairProperty))
]) as (deviceId: string, corsairDevicePropertyId: CorsairDevicePropertyId, index: number, property: unknown) => CorsairError;
// #endregion

// prevent node exit https://github.com/Koromix/koffi/issues/93#issuecomment-1760751390
const intervalKey = setInterval(() => {}, 1000);

let connectCallBack;

const expectedModel = 'VOID PRO WIRELESS';
const expectedModelRegExp = new RegExp(expectedModel, 'i');

function onConnect(): void {
	const filter = {
		deviceTypeMask: CorsairDeviceType.CDT_Headset,
	};
	const devices: CorsairDeviceInfoStruct[] = [{} as CorsairDeviceInfoStruct];
	const size = [0];
	const getDevicesResult = CorsairGetDevices(filter, CORSAIR_DEVICE_COUNT_MAX, devices, size);
	
	if (getDevicesResult !== CorsairError.CE_Success) {
		console.log('Error');
		clearInterval(intervalKey);
		return;
	}

	const device = devices.find(device => expectedModelRegExp.test(device.model));
	if (!device) {
		console.log('Error');
		clearInterval(intervalKey);
		return;
	}

	const deviceId = device.id;
	const property: any = {};
	try {
		const getPropertyResult = CorsairReadDeviceProperty(deviceId, CorsairDevicePropertyId.CDPI_BatteryLevel, 0, property);
		if (getPropertyResult !== CorsairError.CE_Success) {
			console.log('Error');
			clearInterval(intervalKey);
			return;
		}
	} catch {
		console.log('Error');
		clearInterval(intervalKey);
		return;
	}

	console.log(property.value.int32);
	clearInterval(intervalKey);
}

function connect(): void {
	connectCallBack = koffi.register((context: unknown, changes: any) => {
		const decodedChanges = koffi.decode(changes, CorsairSessionStateChanged)
		if (decodedChanges.state === CorsairSessionState.CSS_Connected) {
			onConnect();
		}
		// resolve();
	}, koffi.pointer(CorsairSessionStateChangedHandler));
	
	// await new Promise<void>((resolve) => {
	// });
	const connectResult = CorsairConnect(connectCallBack, undefined);
	if (connectResult !== CorsairError.CE_Success) {
		console.log('Error');
		clearInterval(intervalKey);
	}
}

connect();
