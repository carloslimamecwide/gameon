import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { Colors, Spacing, Typography } from "../../constants/theme";
import { fetchNearbyFields } from "../../services/fields/fields";

// Tipos para o sistema de campos
interface Field {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number; // em km
  rating: number;
  pricePerHour: number;
  type: "5v5" | "7v7" | "11v11";
  amenities: string[];
  images: string[];
  availableSlots: TimeSlot[];
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  price: number;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

export default function FieldsScreen() {
  const insets = useSafeAreaInsets();
  const [fields, setFields] = useState<Field[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "5v5" | "7v7" | "11v11">("all");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Calcular padding inferior para permitir scroll completo
  const bottomPadding = Platform.OS === "ios" ? Math.max(insets.bottom + 80, 100) : Math.max(insets.bottom + 70, 80);

  // Função para calcular distância entre duas coordenadas (fórmula Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Buscar localização do usuário
  useEffect(() => {
    (async () => {
      try {
        setLocationLoading(true);
        setLocationError(null);

        // Verificar permissões
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationError("Permissão de localização negada. Não foi possível buscar campos próximos.");
          setLocationLoading(false);
          return;
        }

        // Obter localização atual
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const currentLocation: UserLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setUserLocation(currentLocation);

        // Buscar campos próximos da API
        const fieldsData = (await fetchNearbyFields(
          currentLocation.latitude,
          currentLocation.longitude,
          10 // raio de 10km
        )) as Field[];

        // Calcular distâncias e ordenar
        const fieldsWithDistance = fieldsData
          .map((field: Field) => ({
            ...field,
            distance: calculateDistance(
              currentLocation.latitude,
              currentLocation.longitude,
              field.latitude,
              field.longitude
            ),
          }))
          .sort((a: Field, b: Field) => (a.distance || 0) - (b.distance || 0));

        setFields(fieldsWithDistance);
      } catch (error) {
        console.error("Erro ao obter localização:", error);
        setLocationError("Erro ao acessar localização. Tente novamente.");
        setFields([]);
      } finally {
        setLocationLoading(false);
      }
    })();
  }, []);

  // Filtrar campos baseado na busca e tipo
  const filteredFields = fields.filter((field) => {
    const matchesSearch =
      field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || field.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleBookField = (field: Field, slot: TimeSlot) => {
    setSelectedField(field);
    setSelectedSlot(slot);
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    if (selectedField && selectedSlot) {
      Alert.alert(
        "Reserva Confirmada! 🎉",
        `Campo: ${selectedField.name}\nHorário: ${selectedSlot.startTime} - ${selectedSlot.endTime}\nPreço: €${selectedSlot.price}`,
        [
          {
            text: "OK",
            onPress: () => {
              setShowBookingModal(false);
              setSelectedField(null);
              setSelectedSlot(null);
            },
          },
        ]
      );
    }
  };

  const renderField = (field: Field) => (
    <View key={field.id} style={styles.fieldCard}>
      {/* Header do Campo */}
      <View style={styles.fieldHeader}>
        <View style={styles.fieldInfo}>
          <Text style={styles.fieldName}>{field.name}</Text>
          <Text style={styles.fieldAddress}>{field.address}</Text>
          <View style={styles.fieldDetails}>
            <Text style={styles.fieldDistance}>📍 {field.distance ? `${field.distance.toFixed(1)}km` : "N/A"}</Text>
            <Text style={styles.fieldRating}>⭐ {field.rating}</Text>
            <Text style={styles.fieldType}>⚽ {field.type}</Text>
          </View>
        </View>
      </View>

      {/* Comodidades */}
      <View style={styles.amenitiesContainer}>
        {field.amenities.map((amenity, index) => (
          <View key={index} style={styles.amenityTag}>
            <Text style={styles.amenityText}>{amenity}</Text>
          </View>
        ))}
      </View>

      {/* Horários Disponíveis */}
      <View style={styles.slotsContainer}>
        <Text style={styles.slotsTitle}>Horários Hoje:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.slotsScroll}>
          {field.availableSlots.map((slot) => (
            <TouchableOpacity
              key={slot.id}
              style={[styles.slotButton, !slot.available && styles.slotButtonDisabled]}
              onPress={() => slot.available && handleBookField(field, slot)}
              disabled={!slot.available}
            >
              <Text style={[styles.slotTime, !slot.available && styles.slotTimeDisabled]}>{slot.startTime}</Text>
              <Text style={[styles.slotPrice, !slot.available && styles.slotPriceDisabled]}>€{slot.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  const renderLocationStatus = () => {
    if (locationLoading) {
      return (
        <View style={styles.locationStatus}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.locationStatusText}>Obtendo sua localização...</Text>
        </View>
      );
    }

    if (locationError) {
      return (
        <View style={styles.locationStatus}>
          <Text style={styles.locationErrorText}>⚠️ {locationError}</Text>
        </View>
      );
    }

    if (userLocation) {
      return (
        <View style={styles.locationStatus}>
          <Text style={styles.locationSuccessText}>📍 Campos próximos à sua localização</Text>
        </View>
      );
    }

    return null;
  };
  return (
    <View style={styles.container}>
      {/* Header com busca e filtros */}
      <View style={styles.header}>
        {renderLocationStatus()}

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar campos..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filtros de tipo */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {[
            { key: "all", label: "Todos" },
            { key: "5v5", label: "5v5" },
            { key: "7v7", label: "7v7" },
            { key: "11v11", label: "11v11" },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[styles.filterButton, selectedType === filter.key && styles.filterButtonActive]}
              onPress={() => setSelectedType(filter.key as any)}
            >
              <Text style={[styles.filterText, selectedType === filter.key && styles.filterTextActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de campos */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
        showsVerticalScrollIndicator={false}
      >
        {filteredFields.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🏟️</Text>
            <Text style={styles.emptyStateTitle}>Nenhum campo encontrado</Text>
            <Text style={styles.emptyStateDescription}>Tente ajustar os filtros ou buscar por outra localização</Text>
          </View>
        ) : (
          <View style={styles.fieldsList}>{filteredFields.map(renderField)}</View>
        )}
      </ScrollView>

      {/* Modal de Reserva */}
      <Modal visible={showBookingModal} animationType="slide" presentationStyle="formSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowBookingModal(false)}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Confirmar Reserva</Text>
            <TouchableOpacity onPress={confirmBooking}>
              <Text style={styles.modalConfirmText}>Reservar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {selectedField && selectedSlot && (
              <>
                <View style={styles.bookingSummary}>
                  <Text style={styles.bookingFieldName}>{selectedField.name}</Text>
                  <Text style={styles.bookingAddress}>{selectedField.address}</Text>

                  <View style={styles.bookingDetails}>
                    <View style={styles.bookingDetailRow}>
                      <Text style={styles.bookingDetailLabel}>Horário:</Text>
                      <Text style={styles.bookingDetailValue}>
                        {selectedSlot.startTime} - {selectedSlot.endTime}
                      </Text>
                    </View>

                    <View style={styles.bookingDetailRow}>
                      <Text style={styles.bookingDetailLabel}>Tipo:</Text>
                      <Text style={styles.bookingDetailValue}>{selectedField.type}</Text>
                    </View>

                    <View style={styles.bookingDetailRow}>
                      <Text style={styles.bookingDetailLabel}>Preço:</Text>
                      <Text style={styles.bookingPrice}>€{selectedSlot.price}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.amenitiesSection}>
                  <Text style={styles.amenitiesSectionTitle}>Comodidades incluídas:</Text>
                  <View style={styles.amenitiesList}>
                    {selectedField.amenities.map((amenity, index) => (
                      <Text key={index} style={styles.amenityItem}>
                        • {amenity}
                      </Text>
                    ))}
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchContainer: {
    marginBottom: Spacing.sm,
  },
  searchInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 14,
    color: Colors.text,
  },
  filtersContainer: {
    flexDirection: "row",
  },
  filterButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginRight: Spacing.xs,
    borderRadius: 16,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: "500",
  },
  filterTextActive: {
    color: Colors.textOnPrimary,
  },
  scrollView: {
    flex: 1,
  },
  fieldsList: {
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  fieldCard: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: Spacing.sm,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: Spacing.sm,
  },
  fieldHeader: {
    marginBottom: Spacing.sm,
  },
  fieldInfo: {
    flex: 1,
  },
  fieldName: {
    ...Typography.subtitle,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  fieldAddress: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  fieldDetails: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  fieldDistance: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  fieldRating: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  fieldType: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: "600",
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  amenityTag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  amenityText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: "500",
  },
  slotsContainer: {
    marginTop: Spacing.xs,
  },
  slotsTitle: {
    ...Typography.caption,
    color: Colors.text,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  slotsScroll: {
    flexDirection: "row",
  },
  slotButton: {
    backgroundColor: Colors.success,
    borderRadius: 6,
    padding: Spacing.xs,
    marginRight: Spacing.xs,
    minWidth: 60,
    alignItems: "center",
  },
  slotButtonDisabled: {
    backgroundColor: Colors.border,
  },
  slotTime: {
    fontSize: 12,
    color: Colors.textOnPrimary,
    fontWeight: "600",
  },
  slotTimeDisabled: {
    color: Colors.textSecondary,
  },
  slotPrice: {
    fontSize: 10,
    color: Colors.textOnPrimary,
  },
  slotPriceDisabled: {
    color: Colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  emptyStateTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  emptyStateDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: Spacing.lg,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalCancelText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  modalTitle: {
    ...Typography.subtitle,
    color: Colors.text,
  },
  modalConfirmText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: "600",
  },
  modalContent: {
    padding: Spacing.md,
  },
  bookingSummary: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  bookingFieldName: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  bookingAddress: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  bookingDetails: {
    gap: Spacing.sm,
  },
  bookingDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bookingDetailLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  bookingDetailValue: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: "500",
  },
  bookingPrice: {
    ...Typography.subtitle,
    color: Colors.primary,
    fontWeight: "600",
  },
  amenitiesSection: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: Spacing.md,
  },
  amenitiesSectionTitle: {
    ...Typography.subtitle,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  amenitiesList: {
    gap: Spacing.xs,
  },
  amenityItem: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  locationStatus: {
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  locationStatusText: {
    ...Typography.caption,
    color: Colors.primary,
    flex: 1,
  },
  locationErrorText: {
    ...Typography.caption,
    color: Colors.error,
    flex: 1,
  },
  locationSuccessText: {
    ...Typography.caption,
    color: Colors.success,
    flex: 1,
    fontWeight: "600",
  },
});
