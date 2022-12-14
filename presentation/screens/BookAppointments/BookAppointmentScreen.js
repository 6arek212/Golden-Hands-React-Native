import { View, Text, RefreshControl } from "react-native";
import React from "react";
import HorizontalChip from "../../components/HorizontalChip";
import { useNavigation } from "@react-navigation/native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import Chip from "../../components/Chip";
import moment from "moment";
import BookViewModel from "./BookViewModel";
import AppointmentConfirmationSheet from "../../components/AppointmentConfirmationSheet";
import Loader from "../../components/Loader";
import Title from "../../components/Title";
import BackButton from "../../components/BackButton";
import Spacer from "../../components/Spacer";
import getString from "../../../localization";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { Platform } from "react-native";


/*------- represent's book appointments Screen ---------- */

const BookAppointmentScreen = () => {
  const {
    refreshing,
    availableAppointments,
    workers,
    workingDates,
    selectedWorker,
    selectedDay,
    selectedService,
    selectedAppointment,
    isLoading,
    onRefresh,
    handleSelectWorker,
    handleSelectDay,
    handleSelectService,
    handleSelectAppointment,
    handleBook,
    handleCloseConfirmation,
  } = BookViewModel();
  const navigation = useNavigation();


  return (
    <View
      style={{ backgroundColor: '#f9f9f9' }}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 10,
      }}
      className="pt-5 flex-1 relative">
      {Platform.OS === 'ios' && <Loader />}
      <View
        className="mb-4  p-1 flex-row ml-2 items-center"
        style={{
          borderBottomColor: "#D9D9D9",
          justifyContent: "space-between",
        }}>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <BackButton onPress={navigation.goBack} />
          <Spacer space={6} />
          <Title text={getString.t('book_appointment')} />
        </View>

      </View>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressBackgroundColor="#fff"
            tintColor="#000"
          />
        }>
        <Animated.View entering={SlideInRight} exiting={SlideOutRight} style={{ alignItems: 'flex-start', marginBottom: 12 }}>
          <Text className="text-xl m-2 mb-5 font-medium">{getString.t('select_worker')}</Text>
          <FlatList
            contentContainerStyle={{ padding: 8, flexGrow: 1 }}
            data={workers}
            keyExtractor={(item) => item._id}
            horizontal={true}
            pagingEnabled
            renderItem={({ item }) => (
              <HorizontalChip
                text={item.firstName + " " + item.lastName}
                imageUrl={item.image}
                user={item}
                onPress={() => { if (!isLoading) handleSelectWorker(item) }}
                isSelected={selectedWorker?._id == item._id}
              />
            )}
            showsHorizontalScrollIndicator={false}
          />
        </Animated.View>
        {
          selectedWorker && (
            <Animated.View entering={SlideInRight} exiting={SlideOutRight} style={{ alignItems: 'flex-start', marginBottom: 12 }} >
              <Text className="text-xl  m-2 mb-5 font-medium">{getString.t('select_day')}</Text>
              <FlatList
                contentContainerStyle={{ padding: 8, flexGrow: 1 }}
                ItemSeparatorComponent={<Spacer space={6} />}
                data={workingDates}
                keyExtractor={(item) => item.date}
                horizontal
                renderItem={({ item }) =>
                  <Chip
                    cardContent={item}
                    id={item}
                    title={moment(item.date).calendar(null, {
                      sameDay: `[${getString.t('today')}]`,
                      nextDay: `[${getString.t('tomorrow')}]`,
                      nextWeek: 'dddd[\n]DD MMM yyyy',
                      lastDay: 'dddd[\n]DD MMM yyyy',
                      lastWeek: 'dddd[\n]DD MMM yyyy',
                      sameElse: 'dddd[\n]DD MMM yyyy',
                    })}
                    handlePress={handleSelectDay}
                    isSelected={selectedDay === item.date}
                  />
                }
                showsHorizontalScrollIndicator={false}
              />
            </Animated.View>
          )
        }
        {
          selectedDay && (
            <Animated.View entering={SlideInRight} exiting={SlideOutRight} style={{ alignItems: 'flex-start', marginBottom: 12 }}>
              <Text className="text-xl  m-2 mb-5 font-medium">
                {getString.t('select_service')}
              </Text>
              <FlatList
                contentContainerStyle={{ padding: 8, flexGrow: 1 }}
                data={selectedWorker?.services}
                keyExtractor={(item) => item._id}
                ItemSeparatorComponent={<Spacer space={6} />}
                horizontal
                renderItem={({ item }) => (
                  <Chip
                    cardContent={item}
                    id={item}
                    title={getString.t(item.title.toLowerCase())}
                    handlePress={() => { if (!isLoading) handleSelectService(item) }}
                    isSelected={selectedService?._id === item._id}
                    price={item.price}
                  />
                )}
                showsHorizontalScrollIndicator={false}
              />
            </Animated.View>
          )
        }

        {
          selectedService && (
            <Animated.View entering={SlideInRight} exiting={SlideOutRight} style={{ alignItems: 'flex-start' }}>
              <Text className="text-xl  m-2 mb-5 font-medium">
                {getString.t('select_hour')}
              </Text>
              <FlatList
                contentContainerStyle={{ padding: 8, flexGrow: 1 }}
                data={availableAppointments}
                keyExtractor={(item) => item._id}
                ItemSeparatorComponent={<Spacer space={6} />}
                horizontal
                renderItem={({ item }) => (
                  <Chip
                    cardContent={item}
                    id={item}
                    title={moment(item.start_time).format("LT")}
                    handlePress={handleSelectAppointment}
                    isSelected={selectedAppointment?._id === item._id}
                  />
                )}
                showsHorizontalScrollIndicator={false}
              />
            </Animated.View>
          )
        }
      </ScrollView>
      {
        selectedAppointment && (
          <AppointmentConfirmationSheet
            id={selectedAppointment}
            appointment={selectedAppointment}
            handleCloseConfirmation={handleCloseConfirmation}
            handleBook={handleBook}
            selectedService={selectedService}
          />
        )
      }
    </View >
  );
};

export default BookAppointmentScreen;
