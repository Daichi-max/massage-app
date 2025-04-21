'use client';

import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Appointment } from '@/types/appointment';
import { Patient } from '@/types/patient';

interface AppointmentMapProps {
  appointments: Appointment[];
  patients: Patient[];
  selectedDate: string;
}

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 35.6812, // 東京駅の緯度
  lng: 139.7671 // 東京駅の経度
};

export const AppointmentMap = ({ appointments, patients, selectedDate }: AppointmentMapProps) => {
  const [markers, setMarkers] = React.useState<Array<{
    position: { lat: number; lng: number };
    title: string;
    address: string;
  }>>([]);

  React.useEffect(() => {
    // 住所から緯度経度を取得する関数
    const geocodeAddress = async (address: string) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return data.results[0].geometry.location;
        }
        return null;
      } catch (error) {
        console.error('Geocoding error:', error);
        return null;
      }
    };

    // 選択された日付の予約の住所を取得してマーカーを設定
    const updateMarkers = async () => {
      const filteredAppointments = appointments.filter(
        (appointment) => appointment.date === selectedDate
      );

      const newMarkers = await Promise.all(
        filteredAppointments.map(async (appointment) => {
          const patient = patients.find((p) => p.id === appointment.patientId);
          if (patient?.address) {
            const location = await geocodeAddress(patient.address);
            if (location) {
              return {
                position: location,
                title: `${patient.lastName} ${patient.firstName}`,
                address: patient.address,
              };
            }
          }
          return null;
        })
      );

      setMarkers(newMarkers.filter((marker): marker is NonNullable<typeof marker> => marker !== null));
    };

    updateMarkers();
  }, [appointments, patients, selectedDate]);

  return (
    <div className="h-full">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={12}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              title={marker.title}
            />
          ))}
        </GoogleMap>
      </LoadScript>
      <div className="mt-2">
        {markers.map((marker, index) => (
          <div key={index} className="text-sm text-gray-600">
            <span className="font-medium">{marker.title}</span>: {marker.address}
          </div>
        ))}
      </div>
    </div>
  );
}; 