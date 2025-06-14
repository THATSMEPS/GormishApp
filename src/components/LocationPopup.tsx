// // components/LocationPopup.tsx

// import { useState, useRef, useEffect, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronDown } from 'lucide-react';
// import { Customer, Area, StructuredCustomerAddress, UpdateCustomerAddressPayload } from "../types/customer.types"; 
// import { updateCustomerAddress } from '../apis/customer.api';
// import MapLocationPicker from './MapLocationPicker'; // MapLocationPicker import kiya

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   onAreaSelect: (areaName: string) => void;
//   initialCustomerData: Customer | null; 
//   initialAvailableAreas: Area[];
//   disableAreaSelection?: boolean;
// }

// export const LocationPopup = ({ 
//   isOpen, 
//   onClose, 
//   onAreaSelect, 
//   disableAreaSelection = false 
// }: Props) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [address, setAddress] = useState(''); // User dwara typed address
//   const [customerData, setCustomerData] = useState<Customer | null>(() => {
//     const storedCustomer = localStorage.getItem('customerData');
//     return storedCustomer ? JSON.parse(storedCustomer) : null;
//   });
//   const [availableAreas, setAvailableAreas] = useState<Area[]>(() => {
//     const storedAreas = localStorage.getItem('availableAreas');
//     return storedAreas ? JSON.parse(storedAreas) : [];
//   });
  
//   const popupRef = useRef<HTMLDivElement>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [selectedMapLocation, setSelectedMapLocation] = useState<{
//     lat: number;
//     lng: number;
//     address: string; // Map se mila hua address string
//   } | null>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (isSubmitting) return; 
//       if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
//         const mapElement = document.querySelector('.leaflet-container');
//         if (mapElement && mapElement.contains(event.target as Node)) {
//             return;
//         }
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isOpen, onClose, isSubmitting]);

//   // ✅ UPDATED useEffect: Component open hone par localStorage se data load karein aur states ko initialize karein
//   // Default values set nahi honge agar data null/empty hai
//   useEffect(() => {
//     if (isOpen) {
//       // localStorage se latest data fetch karein
//       const storedCustomer = localStorage.getItem('customerData');
//       const storedAreas = localStorage.getItem('availableAreas');
      
//       const currentCustomerData: Customer | null = storedCustomer ? JSON.parse(storedCustomer) : null;
//       const currentAvailableAreas: Area[] = storedAreas ? JSON.parse(storedAreas) : [];

//       setCustomerData(currentCustomerData);
//       setAvailableAreas(currentAvailableAreas); // Ensure availableAreas state is up-to-date

//       let initialAddress = '';
//       let initialMapLocation: { lat: number; lng: number; address: string; } | null = null;
//       let initialSearchQuery = ''; // This will hold the area name

//       if (currentCustomerData) {
//           // Check for typedAddress safely
//           if (typeof currentCustomerData.address === 'object' && currentCustomerData.address !== null) {
//             const structuredAddr = currentCustomerData.address as StructuredCustomerAddress;
//             // ✅ FIX: Check if typedAddress is a string before assigning
//             if (typeof structuredAddr.typedAddress === 'string') {
//                 initialAddress = structuredAddr.typedAddress;
//             }
//           } else if (typeof currentCustomerData.address === 'string') { // Backward compatibility for old string address
//               initialAddress = currentCustomerData.address;
//           }
          
//           // Check for map coordinates and mapped address safely
//           if (typeof currentCustomerData.address === 'object' && currentCustomerData.address !== null && 
//               typeof currentCustomerData.address.latitude === 'number' && typeof currentCustomerData.address.longitude === 'number') {
//               initialMapLocation = {
//                   lat: currentCustomerData.address.latitude,
//                   lng: currentCustomerData.address.longitude,
//                   // ✅ FIX: Check if mappedAddress is a string before assigning
//                   address: (typeof currentCustomerData.address.mappedAddress === 'string' && currentCustomerData.address.mappedAddress.trim() !== '') ? currentCustomerData.address.mappedAddress : initialAddress
//               };
//           } else if (currentCustomerData.area?.latitude && currentCustomerData.area?.longitude && initialAddress) {
//               // Fallback for old area lat/lng if address is string, but only if an address is present
//               initialMapLocation = {
//                   lat: currentCustomerData.area.latitude,
//                   lng: currentCustomerData.area.longitude,
//                   address: initialAddress // Use initialAddress as mapped address fallback
//               };
//           }

//           // Check for areaId and find areaName safely
//           // ✅ FIX: Check if areaId is a string before assigning
//           if (typeof currentCustomerData.areaId === 'string' && currentCustomerData.areaId.trim() !== '') {
//               const matchedArea = currentAvailableAreas.find(area => area.id === currentCustomerData.areaId);
//               if (matchedArea) {
//                   initialSearchQuery = matchedArea.areaName;
//               }
//           }
//       }
      
//       // Set states - if checks above didn't find data, they remain empty/null
//       setAddress(initialAddress);
//       setSearchQuery(initialSearchQuery);
//       setSelectedMapLocation(initialMapLocation);

//     }
//   }, [isOpen]); // Dependencies mein ab initialCustomerData aur initialAvailableAreas nahi hai

//   const filteredAreas = (isDropdownOpen && !searchQuery)
//     ? availableAreas
//     : availableAreas.filter(area =>
//         area.areaName.toLowerCase().includes(searchQuery.toLowerCase())
//       );

//   const handleMapLocationSelect = useCallback((lat: number, lng: number, addr: string) => {
//     setSelectedMapLocation({ lat, lng, address: addr });
//   }, []);

//   const isFormValid = () => {
//     // ✅ FIX: Ensure all three fields are filled with non-empty string data
//     // This directly addresses the user's requirement.
//     const isAddressInputFilled = typeof address === 'string' && address.trim() !== '';
    
//     const isAreaSelectedAndValid = typeof searchQuery === 'string' && searchQuery.trim() !== '' &&
//                                  availableAreas.some(area => 
//                                    // ✅ FIX: Ensure area.areaName is string before using toLowerCase
//                                    typeof area.areaName === 'string' && area.areaName.toLowerCase() === searchQuery.toLowerCase()
//                                  );
                                 
//     const isMapLocationDefinitelySelected = selectedMapLocation !== null && 
//                                             typeof selectedMapLocation.address === 'string' && 
//                                             selectedMapLocation.address.trim() !== '' &&
//                                             typeof selectedMapLocation.lat === 'number' && !isNaN(selectedMapLocation.lat) &&
//                                             typeof selectedMapLocation.lng === 'number' && !isNaN(selectedMapLocation.lng);

//     return isAddressInputFilled && isAreaSelectedAndValid && isMapLocationDefinitelySelected && !isSubmitting;
//   };

//   const handleSubmit = async () => {
//     if (isSubmitting || !customerData || !isFormValid()) {
//       console.error("Submission in progress, customer data not loaded, or form is invalid.");
//       return;
//     }

//     setIsSubmitting(true);
    
//     let areaIdToUpdate: string = customerData.areaId; // Default to current customer's areaId
//     let areaNameToPass: string = customerData.area?.areaName || 'Unknown Area';

//     // Dropdown se chune hue areaId ko use karein agar selection enabled hai
//     if (!disableAreaSelection) {
//         const selectedAreaObject = availableAreas.find(area => typeof searchQuery === 'string' && area.areaName.toLowerCase() === searchQuery.toLowerCase());

//         if (!selectedAreaObject) {
//             console.warn("Selected area not found in available areas. Cannot update areaId. Closing popup.");
//             setIsSubmitting(false);
//             onClose(); 
//             return;
//         }
//         areaIdToUpdate = selectedAreaObject.id;
//         areaNameToPass = selectedAreaObject.areaName;
//     }

//     // ✅ UPDATED PAYLOAD STRUCTURE FOR ADDRESS OBJECT
//     const addressPayload = {
//         typedAddress: address, // User ne input field mein jo type kiya hai
//         latitude: selectedMapLocation?.lat || 0, // Map se chuni hui latitude
//         longitude: selectedMapLocation?.lng || 0, // Map se chuni hui longitude
//         mappedAddress: selectedMapLocation?.address || 'Address not mapped', // Map se mila hua address string
//         areaId: areaIdToUpdate, // ✅ areaId ab address object ke andar hai
//     };

//     try {
//       const customerId = customerData.id;
//       // ✅ FIX: Payload mein 'areaId' ko root level par bhi add kiya gaya hai
//       // Yeh tumhari `customer.types.ts` file mein defined `UpdateCustomerAddressPayload` type ko match karega.
//       const payload: UpdateCustomerAddressPayload = {
//         address: addressPayload, // ✅ Ab yeh naya structured address object hai
//         areaId: areaIdToUpdate, // ✅ FIX: areaId ko root level par bhi add kiya gaya hai
//       };

//       console.log("Update Customer Address Payload:", payload); // Debugging ke liye

//       const updateResponse = await updateCustomerAddress(customerId, payload);

//       if (updateResponse.success && updateResponse.data) {
//         console.log("Customer address and area updated successfully:", updateResponse.data);
//         // onAreaSelect ko ab areaName address object se milega
//         // Kyunki customerData.address ab object hai, updateResponse.data.address.area.areaName
//         // ya phir agar area property directly root par hai, toh updateResponse.data.area.areaName
//         // Yahan assumption hai ki updateResponse.data mein `area` object root par hoga
//         onAreaSelect(updateResponse.data.area?.areaName || areaNameToPass); 
//       } else {
//         console.error("Failed to update customer address and area:", updateResponse.message);
//         onAreaSelect(areaNameToPass);
//       }
//     } catch (error) {
//       console.error("Error during customer update:", error);
//       onAreaSelect(areaNameToPass);
//     } finally {
//       setIsSubmitting(false);
//       onClose();
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-[2px]">
//           <motion.div
//             ref={popupRef}
//             initial={{ y: -20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: -20, opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             className={`absolute top-0 left-0 right-0 p-4 ${isSubmitting ? 'pointer-events-none' : ''}`}
//           >
//             <div
//               className="rounded-[25px] p-6 max-w-xl mx-auto shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20"
//               style={{
//                 background: 'rgba(242, 242, 245, 0.95)',
//                 backdropFilter: 'blur(20px)',
//                 WebkitBackdropFilter: 'blur(20px)',
//               }}
//             >
//               <div className="space-y-4">
//                 {/* Location Header */}
//                 <div
//                   className="rounded-[15px] p-4 flex flex-col justify-between items-start"
//                   style={{
//                     background: 'rgba(255, 255, 255, 1)',
//                     backdropFilter: 'blur(12px)',
//                     WebkitBackdropFilter: 'blur(12px)',
//                   }}
//                 >
//                   <span className="font-semibold">Location</span>
//                   <span className="text-gray-500 font-light truncate max-w-[100%]">
//                     {/* Display current customer's combined address. Ab address object ho sakta hai. */}
//                     {customerData?.address
//                         ? (typeof customerData.address === 'string' 
//                             ? `${customerData.address} | ${customerData.area?.areaName || 'Unknown Area'}`
//                             : `${(customerData.address as StructuredCustomerAddress)?.typedAddress || 'N/A'} | ${customerData.area?.areaName || 'Unknown Area'}`
//                           )
//                         : 'Loading Location...'
//                     }
//                   </span>
//                 </div>

//                 {/* Address Input */}
//                 <div
//                   className="rounded-[15px] p-4"
//                   style={{
//                     background: 'rgba(255, 255, 255, 1)',
//                     backdropFilter: 'blur(12px)',
//                     WebkitBackdropFilter: 'blur(12px)',
//                   }}
//                 >
//                   <input
//                     type="text"
//                     placeholder="Enter/Change Address (Street, Building, etc.)"
//                     value={address}
//                     onChange={(e) => setAddress(e.target.value)}
//                     className="w-full font-light focus:outline-none bg-transparent"
//                     disabled={isSubmitting}
//                   />
//                 </div>

//                 {/* Area Selector */}
//                 <div className="relative">
//                   <div
//                     className={`rounded-[15px] p-4 flex justify-between items-center ${disableAreaSelection ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
//                     style={{
//                       background: 'rgba(255, 255, 255, 0.85)',
//                       backdropFilter: 'blur(12px)',
//                       WebkitBackdropFilter: 'blur(12px)',
//                     }}
//                     onClick={() => !disableAreaSelection && setIsDropdownOpen(!isDropdownOpen)}
//                   >
//                     <input
//                       type="text"
//                       placeholder="Choose Area"
//                       value={searchQuery}
//                       onChange={(e) => {
//                         if (!disableAreaSelection) {
//                           setSearchQuery(e.target.value);
//                           setIsDropdownOpen(true);
//                         }
//                       }}
//                       className={`w-full font-light focus:outline-none bg-transparent ${disableAreaSelection ? 'cursor-not-allowed opacity-60' : ''}`}
//                       onClick={(e) => e.stopPropagation()}
//                       disabled={isSubmitting || disableAreaSelection}
//                     />
//                     {!disableAreaSelection && (
//                       <ChevronDown
//                         className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
//                       />
//                     )}
//                   </div>

//                   {/* Dropdown Options */}
//                   <AnimatePresence>
//                     {isDropdownOpen && !disableAreaSelection && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                         className="absolute top-full left-0 right-0 mt-2 rounded-[15px] shadow-lg max-h-[300px] overflow-y-auto z-[2000]"
//                         style={{
//                           background: 'rgba(255, 255, 255, 1)',
//                           backdropFilter: 'blur(12px)',
//                           WebkitBackdropFilter: 'blur(12px)',
//                         }}
//                       >
//                         {filteredAreas.map((area) => (
//                           <div
//                             key={area.id}
//                             className="p-3 hover:bg-white/50 cursor-pointer font-light transition-colors"
//                             onClick={() => {
//                               if (!isSubmitting && !disableAreaSelection) {
//                                 setSearchQuery(area.areaName);
//                                 setIsDropdownOpen(false);
//                               }
//                             }}
//                           >
//                             {area.areaName}
//                           </div>
//                         ))}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>

//                 {/* Map locations embedding */}
//                 <div className="mt-4">
//                   <MapLocationPicker
//                     initialLat={selectedMapLocation?.lat || 23.237560} 
//                     initialLng={selectedMapLocation?.lng || 72.647781}
//                     initialZoom={13}
//                     onLocationSelect={handleMapLocationSelect}
//                   />
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   className={`w-full text-white rounded-full py-3 font-semibold transition-colors ${
//                     isFormValid() ? 'bg-[#6552FF] hover:bg-opacity-90' : 'bg-gray-400 cursor-not-allowed'
//                   }`}
//                   onClick={handleSubmit}
//                   disabled={!isFormValid()}
//                 >
//                   {isSubmitting ? 'Updating Location...' : 'Update Location'}
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// };







import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Customer, Area, StructuredCustomerAddress, UpdateCustomerAddressPayload } from "../types/customer.types";
import { updateCustomerAddress } from '../apis/customer.api';
import MapLocationPicker from './MapLocationPicker';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAreaSelect: (areaName: string) => void;
  initialCustomerData: Customer | null; // This prop is not directly used in the useEffect anymore, but kept for interface consistency
  initialAvailableAreas: Area[]; // This prop is not directly used in the useEffect anymore, but kept for interface consistency
  disableAreaSelection?: boolean;
}

export const LocationPopup = ({
  isOpen,
  onClose,
  onAreaSelect,
  disableAreaSelection = false
}: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [address, setAddress] = useState(''); // User dwara typed address
  const [customerData, setCustomerData] = useState<Customer | null>(() => {
    const storedCustomer = localStorage.getItem('customerData');
    return storedCustomer ? JSON.parse(storedCustomer) : null;
  });
  const [availableAreas, setAvailableAreas] = useState<Area[]>(() => {
    const storedAreas = localStorage.getItem('availableAreas');
    return storedAreas ? JSON.parse(storedAreas) : [];
  });

  const popupRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedMapLocation, setSelectedMapLocation] = useState<{
    lat: number;
    lng: number;
    address: string; // Map se mila hua address string
  } | null>(null);

  // ✅ NEW STATE: To control the map's current center
  const [currentMapCenter, setCurrentMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSubmitting) return;
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        const mapElement = document.querySelector('.leaflet-container');
        if (mapElement && mapElement.contains(event.target as Node)) {
          return;
        }
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, isSubmitting]);

  // ✅ UPDATED useEffect: Component open hone par localStorage se data load karein aur states ko initialize karein
  // Default values set nahi honge agar data null/empty hai
  useEffect(() => {
    if (isOpen) {
      // localStorage se latest data fetch karein
      const storedCustomer = localStorage.getItem('customerData');
      const storedAreas = localStorage.getItem('availableAreas');

      const currentCustomerData: Customer | null = storedCustomer ? JSON.parse(storedCustomer) : null;
      const currentAvailableAreas: Area[] = storedAreas ? JSON.parse(storedAreas) : [];

      setCustomerData(currentCustomerData);
      setAvailableAreas(currentAvailableAreas); // Ensure availableAreas state is up-to-date

      let initialAddress = '';
      let initialMapLocation: { lat: number; lng: number; address: string; } | null = null;
      let initialSearchQuery = ''; // This will hold the area name
      let initialCenterLat = 23.237560; // Default to Gandhinagar
      let initialCenterLng = 72.647781; // Default to Gandhinagar


      if (currentCustomerData) {
        // Check for typedAddress safely
        if (typeof currentCustomerData.address === 'object' && currentCustomerData.address !== null) {
          const structuredAddr = currentCustomerData.address as StructuredCustomerAddress;
          if (typeof structuredAddr.typedAddress === 'string') {
            initialAddress = structuredAddr.typedAddress;
          }
        } else if (typeof currentCustomerData.address === 'string') { // Backward compatibility for old string address
          initialAddress = currentCustomerData.address;
        }

        // Check for map coordinates and mapped address safely
        if (typeof currentCustomerData.address === 'object' && currentCustomerData.address !== null &&
          typeof currentCustomerData.address.latitude === 'number' && typeof currentCustomerData.address.longitude === 'number') {
          initialMapLocation = {
            lat: currentCustomerData.address.latitude,
            lng: currentCustomerData.address.longitude,
            address: (typeof currentCustomerData.address.mappedAddress === 'string' && currentCustomerData.address.mappedAddress.trim() !== '') ? currentCustomerData.address.mappedAddress : initialAddress
          };
          initialCenterLat = currentCustomerData.address.latitude;
          initialCenterLng = currentCustomerData.address.longitude;
        } else if (currentCustomerData.area?.latitude && currentCustomerData.area?.longitude) { // Fallback for old area lat/lng
          initialMapLocation = {
            lat: currentCustomerData.area.latitude,
            lng: currentCustomerData.area.longitude,
            address: initialAddress // Use initialAddress as mapped address fallback
          };
          initialCenterLat = currentCustomerData.area.latitude;
          initialCenterLng = currentCustomerData.area.longitude;
        }

        // Check for areaId and find areaName safely
        if (typeof currentCustomerData.areaId === 'string' && currentCustomerData.areaId.trim() !== '') {
          const matchedArea = currentAvailableAreas.find(area => area.id === currentCustomerData.areaId);
          if (matchedArea) {
            initialSearchQuery = matchedArea.areaName;
            // If area coordinates are available, use them as initial map center
            if (matchedArea.latitude && matchedArea.longitude) {
                initialCenterLat = matchedArea.latitude;
                initialCenterLng = matchedArea.longitude;
            }
          }
        }
      }

      // Set states - if checks above didn't find data, they remain empty/null
      setAddress(initialAddress);
      setSearchQuery(initialSearchQuery);
      setSelectedMapLocation(initialMapLocation);
      setCurrentMapCenter({ lat: initialCenterLat, lng: initialCenterLng }); // Set initial map center
    }
  }, [isOpen]); // Dependencies mein ab initialCustomerData aur initialAvailableAreas nahi hai

  const filteredAreas = (isDropdownOpen && !searchQuery)
    ? availableAreas
    : availableAreas.filter(area =>
        area.areaName.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleMapLocationSelect = useCallback((lat: number, lng: number, addr: string) => {
    setSelectedMapLocation({ lat, lng, address: addr });
    // When map location is selected by click, also update currentMapCenter
    setCurrentMapCenter({ lat, lng });
  }, []);

  const isFormValid = () => {
    const isAddressInputFilled = typeof address === 'string' && address.trim() !== '';

    const isAreaSelectedAndValid = typeof searchQuery === 'string' && searchQuery.trim() !== '' &&
                                 availableAreas.some(area =>
                                     typeof area.areaName === 'string' && area.areaName.toLowerCase() === searchQuery.toLowerCase()
                                 );

    const isMapLocationDefinitelySelected = selectedMapLocation !== null &&
                                           typeof selectedMapLocation.address === 'string' &&
                                           selectedMapLocation.address.trim() !== '' &&
                                           typeof selectedMapLocation.lat === 'number' && !isNaN(selectedMapLocation.lat) &&
                                           typeof selectedMapLocation.lng === 'number' && !isNaN(selectedMapLocation.lng);

    return isAddressInputFilled && isAreaSelectedAndValid && isMapLocationDefinitelySelected && !isSubmitting;
  };

  const handleSubmit = async () => {
    if (isSubmitting || !customerData || !isFormValid()) {
      console.error("Submission in progress, customer data not loaded, or form is invalid.");
      return;
    }

    setIsSubmitting(true);

    let areaIdToUpdate: string = customerData.areaId; // Default to current customer's areaId
    let areaNameToPass: string = customerData.area?.areaName || 'Unknown Area';

    // Dropdown se chune hue areaId ko use karein agar selection enabled hai
    if (!disableAreaSelection) {
        const selectedAreaObject = availableAreas.find(area => typeof searchQuery === 'string' && area.areaName.toLowerCase() === searchQuery.toLowerCase());

        if (!selectedAreaObject) {
            console.warn("Selected area not found in available areas. Cannot update areaId. Closing popup.");
            setIsSubmitting(false);
            onClose();
            return;
        }
        areaIdToUpdate = selectedAreaObject.id;
        areaNameToPass = selectedAreaObject.areaName;
    }

    // ✅ UPDATED PAYLOAD STRUCTURE FOR ADDRESS OBJECT
    const addressPayload = {
        typedAddress: address, // User ne input field mein jo type kiya hai
        latitude: selectedMapLocation?.lat || 0, // Map se chuni hui latitude
        longitude: selectedMapLocation?.lng || 0, // Map se chuni hui longitude
        mappedAddress: selectedMapLocation?.address || 'Address not mapped', // Map se mila hua address string
        areaId: areaIdToUpdate, // ✅ areaId ab address object ke andar hai
    };

    try {
      const customerId = customerData.id;
      // ✅ FIX: Payload mein 'areaId' ko root level par bhi add kiya gaya hai
      // Yeh tumhari `customer.types.ts` file mein defined `UpdateCustomerAddressPayload` type ko match karega.
      const payload: UpdateCustomerAddressPayload = {
        address: addressPayload, // ✅ Ab yeh naya structured address object hai
        areaId: areaIdToUpdate, // ✅ FIX: areaId ko root level par bhi add kiya gaya hai
      };

      console.log("Update Customer Address Payload:", payload); // Debugging ke liye

      const updateResponse = await updateCustomerAddress(customerId, payload);

      if (updateResponse.success && updateResponse.data) {
        console.log("Customer address and area updated successfully:", updateResponse.data);
        onAreaSelect(updateResponse.data.area?.areaName || areaNameToPass);
      } else {
        console.error("Failed to update customer address and area:", updateResponse.message);
        onAreaSelect(areaNameToPass);
      }
    } catch (error) {
      console.error("Error during customer update:", error);
      onAreaSelect(areaNameToPass);
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-[2px]">
          <motion.div
            ref={popupRef}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-0 left-0 right-0 p-4 ${isSubmitting ? 'pointer-events-none' : ''}`}
          >
            <div
              className="rounded-[25px] p-6 max-w-xl mx-auto shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20"
              style={{
                background: 'rgba(242, 242, 245, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <div className="space-y-4">
                {/* Location Header */}
                <div
                  className="rounded-[15px] p-4 flex flex-col justify-between items-start"
                  style={{
                    background: 'rgba(255, 255, 255, 1)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                >
                  <span className="font-semibold">Location</span>
                  <span className="text-gray-500 font-light truncate max-w-[100%]">
                    {customerData?.address
                        ? (typeof customerData.address === 'string'
                            ? `${customerData.address} | ${customerData.area?.areaName || 'Unknown Area'}`
                            : `${(customerData.address as StructuredCustomerAddress)?.typedAddress || 'N/A'} | ${customerData.area?.areaName || 'Unknown Area'}`
                          )
                        : 'Loading Location...'
                    }
                  </span>
                </div>

                {/* Address Input */}
                <div
                  className="rounded-[15px] p-4"
                  style={{
                    background: 'rgba(255, 255, 255, 1)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Enter/Change Address (Street, Building, etc.)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full font-light focus:outline-none bg-transparent"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Area Selector */}
                <div className="relative">
                  <div
                    className={`rounded-[15px] p-4 flex justify-between items-center ${disableAreaSelection ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                    style={{
                      background: 'rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                    }}
                    onClick={() => !disableAreaSelection && setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <input
                      type="text"
                      placeholder="Choose Area"
                      value={searchQuery}
                      onChange={(e) => {
                        if (!disableAreaSelection) {
                          setSearchQuery(e.target.value);
                          setIsDropdownOpen(true);
                        }
                      }}
                      className={`w-full font-light focus:outline-none bg-transparent ${disableAreaSelection ? 'cursor-not-allowed opacity-60' : ''}`}
                      onClick={(e) => e.stopPropagation()}
                      disabled={isSubmitting || disableAreaSelection}
                    />
                    {!disableAreaSelection && (
                      <ChevronDown
                        className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    )}
                  </div>

                  {/* Dropdown Options */}
                  <AnimatePresence>
                    {isDropdownOpen && !disableAreaSelection && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 rounded-[15px] shadow-lg max-h-[300px] overflow-y-auto z-[2000]"
                        style={{
                          background: 'rgba(255, 255, 255, 1)',
                          backdropFilter: 'blur(12px)',
                          WebkitBackdropFilter: 'blur(12px)',
                        }}
                      >
                        {filteredAreas.map((area) => (
                          <div
                            key={area.id}
                            className="p-3 hover:bg-white/50 cursor-pointer font-light transition-colors"
                            onClick={() => {
                              if (!isSubmitting && !disableAreaSelection) {
                                setSearchQuery(area.areaName);
                                setIsDropdownOpen(false);
                                // ✅ IMPORTANT: Update currentMapCenter when an area is selected from dropdown
                                if (area.latitude && area.longitude) {
                                    setCurrentMapCenter({ lat: area.latitude, lng: area.longitude });
                                    // Also update selectedMapLocation to match the area's coordinates
                                    // if you want the marker to immediately move to the area's center
                                    // This assumes area.areaName can serve as a temporary mapped address.
                                    setSelectedMapLocation({ lat: area.latitude, lng: area.longitude, address: area.areaName });
                                } else {
                                    // If selected area doesn't have coordinates, reset selectedMapLocation
                                    // or handle as appropriate (e.g., keep the old selected map location)
                                    setSelectedMapLocation(null); // Or keep existing if that's desired behavior
                                    setCurrentMapCenter(null); // This will fallback to default Gandhinagar if null
                                }
                              }
                            }}
                          >
                            {area.areaName}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Map locations embedding */}
                <div className="mt-4">
                  <MapLocationPicker
                    // ✅ UPDATED: Use currentMapCenter for initialLat and initialLng
                    initialLat={currentMapCenter?.lat || 23.237560}
                    initialLng={currentMapCenter?.lng || 72.647781}
                    initialZoom={15}
                    onLocationSelect={handleMapLocationSelect}
                  />
                </div>

                {/* Submit Button */}
                <button
                  className={`w-full text-white rounded-full py-3 font-semibold transition-colors ${
                    isFormValid() ? 'bg-[#6552FF] hover:bg-opacity-90' : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  onClick={handleSubmit}
                  disabled={!isFormValid()}
                >
                  {isSubmitting ? 'Updating Location...' : 'Update Location'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};