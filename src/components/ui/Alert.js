import React, { useState } from 'react';
import { Modal, Text, View, StyleSheet } from 'react-native';
import GlobalButton from './GlobalButton';
import { PRIMARY_COLOR } from '../../constants';

export default function Alert({ visible, onClose, message }) {
    return (
        <Modal
            presentationStyle='overFullScreen'
            animationType="slide"
            transparent={true}
            visible={visible}>
            <View style={styles.centerView}>
                <View style={styles.modalContainer}>
                    <Text style={{position: 'absolute', top: 20, color: PRIMARY_COLOR, fontFamily: 'Inter-Bold', fontSize: 20}}> Alert </Text>
                    <Text style={{color: 'black', fontFamily: 'Poppins-Regular', fontSize: 17.5}}>{message} </Text>
                    <GlobalButton style={styles.closeButton} onPress={onClose}>
                        <Text style={{ color: 'white', fontFamily: 'Inter-Bold' }}> Close </Text>
                    </GlobalButton>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centerView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        alignSelf: 'center'
    },
    modalContainer: {
        backgroundColor: "#fff",
        width: 300,
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        borderRadius: 20
    },
    closeButton: {
        backgroundColor: PRIMARY_COLOR,
        width: '100%',
        position: 'absolute',
        bottom: 20
    }
})