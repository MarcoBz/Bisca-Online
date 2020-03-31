<template>
    <div>
        <svg
            width="68"
            height="98"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            >
                <use v-bind= "{ 'xlink:href': require('../../assets/svg-cards-indented.svg') + `#${cardsReference[parseInt(cardIndex)]}`}" x="0" y="0" transform="scale(0.4)"/>
        </svg>           
    </div>
</template>

<script>
export default {
    name: "Card",
    props: ['cardIndex'],
    data () {
        return {
            cardsReference: {
            1: 'heart_king',
            2: 'heart_queen',
            3: 'heart_jack',
            4: 'heart_10',
            5: 'heart_9',
            6: 'heart_8',
            7: 'heart_7',
            8: 'heart_6',
            9: 'heart_5',
            10: 'heart_4',
            11: 'heart_3',
            12: 'heart_2',
            13: 'heart_1',
            14: 'diamond_king',
            15: 'diamond_queen',
            16: 'diamond_jack',
            17: 'diamond_10',
            18: 'diamond_9',
            19: 'diamond_8',
            20: 'diamond_7',
            21: 'diamond_6',
            22: 'diamond_5',
            23: 'diamond_4',
            24: 'diamond_3',
            25: 'diamond_2',
            26: 'diamond_1',
            27: 'club_king',
            28: 'club_queen',
            29: 'club_jack',
            30: 'club_10',
            31: 'club_9',
            32: 'club_8',
            33: 'club_7',
            34: 'club_6',
            35: 'club_5',
            36: 'club_4',
            37: 'club_3',
            38: 'club_2',
            39: 'club_1',
            40: 'spade_king',
            41: 'spade_queen',
            42: 'spade_jack', 
            43: 'spade_10', 
            44: 'spade_9',
            45: 'spade_8', 
            46: 'spade_7', 
            47: 'spade_6', 
            48: 'spade_5', 
            49: 'spade_4', 
            50: 'spade_3', 
            51: 'spade_2', 
            52: 'spade_1', 
            53: 'back'
            }


        }
    }
}
</script>