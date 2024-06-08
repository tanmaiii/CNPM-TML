import { userApi } from "@/apis";
import CustomModal from "@/components/CustomModal";
import apiConfig from "@/configs/axios/apiConfig";
import IMAGES from "@/constants/images";
import { useAuth } from "@/context/AuthContext";
import { NavigationProp } from "@/navigators/TStack";
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, HEIGHT, SPACING } from "@/theme/theme";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faAngleRight,
  faArrowRightFromBracket,
  faCircleQuestion,
  faGear,
  faPenToSquare,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { WINDOW_HEIGHT } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import numeral from "numeral";
import * as React from "react";
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";

interface UserAccountProps {}

const UserAccount = (props: UserAccountProps) => {
  const [openModal, setOpenModal] = React.useState(false);
  const { logout } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const { currentUser } = useAuth();
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const queryClient = useQueryClient();

  const { data: followers } = useQuery({
    queryKey: ["followers"],
    queryFn: async () => {
      const res = await userApi.getCountFollowers(currentUser.id);
      return res;
    },
  });

  const { data: following } = useQuery({
    queryKey: ["following"],
    queryFn: async () => {
      const res = await userApi.getCountFollowing(currentUser.id);
      return res;
    },
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity>
            <Image source={IMAGES.LOGO} style={styles.headerImage} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
      </SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.White1} />
        }
      >
        <TouchableHighlight
          underlayColor={COLORS.Black}
          onPress={() => navigation.navigate("Artist", { userId: currentUser?.id })}
        >
          <View style={styles.account}>
            <View style={styles.accountLeft}>
              <Image
                style={styles.accountAvatar}
                source={
                  currentUser?.image_path
                    ? { uri: apiConfig.imageURL(currentUser.image_path) }
                    : IMAGES.AVATAR
                }
              />
              <View style={styles.accountBody}>
                <Text numberOfLines={1} style={[styles.textMain]}>
                  {currentUser.name}
                </Text>
                <Text numberOfLines={1} style={styles.textEtra}>
                  {currentUser.email}
                </Text>
              </View>
            </View>
            <View style={styles.accountRight}>
              <View style={styles.flexCenter}>
                <Text style={styles.textMain}>{numeral(followers).format("0a").toUpperCase()}</Text>
                <Text style={styles.textEtra}>followers</Text>
              </View>
              <View style={styles.flexCenter}>
                <Text style={styles.textMain}>{numeral(following).format("0a").toUpperCase()}</Text>
                <Text style={styles.textEtra}>following</Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>

        <View style={styles.line} />

        <Item
          icon={faUser}
          title="Edit profile"
          func={() => navigation.navigate("UserEditProfile")}
        />

        <Item
          icon={faPenToSquare}
          title="Edit Information"
          func={() => navigation.navigate("UserEditProfile")}
        />

        <Item icon={faGear} title="Settings" func={() => navigation.navigate("UserEditProfile")} />

        <Item
          icon={faCircleQuestion}
          title="Help & Support"
          func={() => navigation.navigate("UserEditProfile")}
        />

        <View style={styles.line} />

        <TouchableHighlight underlayColor={COLORS.Black} onPress={() => setOpenModal(true)}>
          <View style={styles.box}>
            <View style={styles.boxLeft}>
              <View style={styles.boxIcon}>
                <FontAwesomeIcon
                  icon={faArrowRightFromBracket}
                  size={20}
                  style={{ color: COLORS.Red }}
                />
              </View>
              <Text style={[styles.textMain, { color: COLORS.Red }]}>Log out</Text>
            </View>
            <View>
              <FontAwesomeIcon icon={faAngleRight} size={20} style={{ color: COLORS.White2 }} />
            </View>
          </View>
        </TouchableHighlight>
      </ScrollView>

      <CustomModal
        withInput={true}
        isOpen={openModal}
        setIsOpen={setOpenModal}
        header={"Sign out of your account"}
        modalFunction={() => logout()}
      >
        <Text style={{ color: COLORS.White1, fontSize: FONTSIZE.size_16 }}>
          Are you sure you want to sign out?
        </Text>
        <TextInput />
      </CustomModal>
    </View>
  );
};

export default UserAccount;

const Item = ({ icon, title, func }: { icon: IconProp; title: string; func: () => void }) => {
  return (
    <TouchableHighlight underlayColor={COLORS.Black} onPress={() => func()}>
      <View style={styles.box}>
        <View style={styles.boxLeft}>
          <View style={styles.boxIcon}>
            <FontAwesomeIcon icon={icon} size={20} style={{ color: COLORS.Primary }} />
          </View>
          <Text style={styles.textMain}>{title}</Text>
        </View>
        <View>
          <FontAwesomeIcon icon={faAngleRight} size={20} style={{ color: COLORS.White2 }} />
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Black1,
    minHeight: WINDOW_HEIGHT,
    // padding: SPACING.space_10,
  },
  flexCenter: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.space_4,
  },
  line: { width: "100%", height: 0.3, backgroundColor: COLORS.WhiteRGBA15, marginVertical: 4 },
  textMain: {
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.medium,
    color: COLORS.White1,
  },
  textEtra: {
    fontSize: FONTSIZE.size_14,
    fontFamily: FONTFAMILY.regular,
    color: COLORS.White2,
  },
  header: {
    height: HEIGHT.UPPER_HEADER_SEARCH_HEIGHT,
    padding: SPACING.space_10,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.space_8,
  },
  headerImage: { width: 40, height: 40 },
  headerTitle: {
    fontSize: FONTSIZE.size_24,
    color: COLORS.White1,
    fontFamily: FONTFAMILY.bold,
  },
  account: {
    width: "100%",
    // backgroundColor: COLORS.Black2,
    padding: SPACING.space_20,
    alignItems: "center",
    textAlign: "center",
    justifyContent: "space-between",
    gap: SPACING.space_16,
    flexDirection: "row",
  },
  accountLeft: {
    flexDirection: "row",
    gap: SPACING.space_16,
    alignItems: "center",
  },
  accountRight: {
    flexDirection: "row",
    gap: SPACING.space_16,
    alignItems: "center",
  },
  accountAvatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: COLORS.Black2,
  },
  accountBody: {
    gap: SPACING.space_4,
    maxWidth: 100,
  },
  accountBox: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: SPACING.space_20,
    paddingVertical: SPACING.space_12,
    justifyContent: "space-between",
    gap: SPACING.space_8,
  },
  box: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: SPACING.space_12,
    paddingVertical: SPACING.space_12,
    justifyContent: "space-between",
    borderRadius: BORDERRADIUS.radius_14,
    overflow: "hidden",
  },
  boxLeft: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.space_8,
  },
  boxIcon: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.Black2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BORDERRADIUS.radius_14,
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
  },
  buttonLogout: {
    backgroundColor: COLORS.White1,
    paddingHorizontal: SPACING.space_20,
    paddingVertical: SPACING.space_12,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.space_4,
  },
});