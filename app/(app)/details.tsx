import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// @TODO: Adicionar uma opção de listagem de roteiros
// @TODO: Adicionar opção de vincular ponto  um roteiro existente compatível ( deve necessariamente estar no mesmo local )
//        após selecioanar o roteiro expecífico deve selecionar um dia vago

export default function DetailsScreen() {
    const SCREEN_WIDTH = Dimensions.get("window").width;
    const cardSize = SCREEN_WIDTH * 0.25;
    const cardSize2 = SCREEN_WIDTH * 0.33;
    const cardSize3 = SCREEN_WIDTH * 0.2;
    const tags = ["Praia", "Restaurante", "Família", "Pet Friendly", "Natureza"];
    const { id } = useLocalSearchParams();

    const handleGoBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/home");
        }
    };

    const contatos = [
        { nome: "Telefone", icone: "call", profile: "(xx) xxxxx-xxxx" },
        { nome: "Instagram", icone: "logo-instagram", profile: "@navtour" },
        { nome: "TikTok", icone: "logo-tiktok", profile: "@navtour" },
        { nome: "YouTube", icone: "logo-youtube", profile: "@navtour" },
        { nome: "Facebook", icone: "logo-facebook", profile: "@navtour" },
    ];

    const semelhantes = [
        { nome: "Local A", imagem: "https://blog.123milhas.com/wp-content/uploads/2021/12/BANNER-TEM-QUE-IR-CUMBUCO-123MILHAS.jpg" },
        { nome: "Local B", imagem: "https://blog.123milhas.com/wp-content/uploads/2021/12/BANNER-TEM-QUE-IR-CUMBUCO-123MILHAS.jpg" },
        { nome: "Local C", imagem: "https://blog.123milhas.com/wp-content/uploads/2021/12/BANNER-TEM-QUE-IR-CUMBUCO-123MILHAS.jpg" },
        { nome: "Local C", imagem: "https://blog.123milhas.com/wp-content/uploads/2021/12/BANNER-TEM-QUE-IR-CUMBUCO-123MILHAS.jpg" },
    ];

    return (
        <SafeAreaView className="flex-1 bg-secondary">
            <TouchableOpacity onPress={handleGoBack} className="absolute mt-10 ml-5 z-10 bg-black/50 rounded-full p-2">
                <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="relative w-full h-60">
                    <Image
                        source={{ uri: "https://blog.123milhas.com/wp-content/uploads/2021/12/BANNER-TEM-QUE-IR-CUMBUCO-123MILHAS.jpg" }}
                        className="w-full h-full"
                    />
                    <View className="absolute bottom-3 left-4">
                        <Text className="text-white text-h3 font-bold">Nome do local</Text>
                        <Text className="text-white text-body">Endereço do local</Text>
                    </View>
                </View>

                <TouchableOpacity className="bg-primary py-3 my-3 mx-4 rounded-button flex-row justify-center items-center">
                    <Ionicons name="heart" size={22} color="#FFFFFF" />
                    <Text className="text-h3 ml-2 text-white">Favoritar</Text>
                </TouchableOpacity>

                <View className="mx-4 bg-white rounded-card py-3 items-center">
                    <View className="flex-row justify-center w-full">
                        <View className="bg-orange px-4 py-2 rounded-button">
                            <Text className="text-body font-bold text-white">Aberto</Text>
                        </View>
                        <View className="bg-orange px-4 py-2 rounded-button ml-2">
                            <Text className="text-body font-bold text-white">Distância: 2km</Text>
                        </View>
                    </View>
                </View>

                <View className="mx-4 mt-4">
                    <Text className="text-h3 text-primary font-bold mb-2">Tags</Text>
                    <View className="flex-row flex-wrap justify-center gap-2">
                        {tags.map((tag, index) => (
                            <View
                                key={index}
                                className="bg-primary rounded-button px-4 py-2"
                            >
                                <Text className="text-body text-white font-bold">{tag}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View className="mx-4 mt-4">
                    <Text className="text-h3 text-primary font-bold">Descrição</Text>
                    <Text className="text-body text-justify">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </Text>
                </View>

                <View className="bg-white mx-4 mt-4 rounded-card p-4">
                    <View className="flex-row mb-2 justify-center text-primary items-center">
                        <Ionicons name="time" size={28} color="#1238b4" />
                        <Text className="ml-2 text-h3 text-primary font-bold text-center">
                            Horário de Funcionamento
                        </Text>
                    </View>
                    {[
                        ["Domingo", "Fechado"],
                        ["Segunda-feira", "Fechado"],
                        ["Terça-feira", "Fechado"],
                        ["Quarta-feira", "Fechado"],
                        ["Quinta-feira", "22:00 - 05:00"],
                        ["Sexta-feira", "22:00 - 05:00"],
                        ["Sábado", "22:00 - 05:00"],
                    ].map(([dia, horario], i) => (
                        <Text key={i} className="text-center text-gray-700">
                            {dia} — {horario}
                        </Text>
                    ))}
                </View>

                <View className="mx-4 mt-4">
                    <Text className="text-h3 text-primary font-bold mb-2">Contato</Text>
                    <View className="flex-row flex-wrap justify-center gap-4">
                        {contatos.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    width: cardSize,
                                    height: cardSize,
                                }}
                                className="bg-white items-center rounded-card p-3 w-28"
                            >
                                <Ionicons name={item.icone as any} size={28} color="#1238b4" />
                                <Text className="text-small text-center">{item.nome}</Text>
                                <Text className="text-small text-center">{item.profile}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View className="mx-4 mt-6 mb-24">
                    <Text className="text-h3 text-primary font-bold mb-2">Semelhantes</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {semelhantes.map((item, index) => (
                            <TouchableOpacity key={index} style={{
                                width: cardSize2,
                            }} className="mr-3 bg-white rounded-card">
                                <Image
                                    source={{ uri: item.imagem }}
                                    className="w-40 h-24 rounded-lg"
                                    style={{
                                        width: cardSize2,
                                        height: cardSize3,
                                    }}
                                />
                                <View className="p-2">
                                    <Text className="text-body text-primary font-bold text-left">
                                        {item.nome}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>

            <TouchableOpacity className="absolute bottom-0 left-0 right-0 bg-primary py-4 items-center">
                <Text className="text-white font-semibold text-h3">
                    Começar a Planejar
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}