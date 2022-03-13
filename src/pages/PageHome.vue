<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-sm">
        <div class="col">
          <q-input
            class="new-qweet"
            bottom-slots
            v-model="newQweetContent"
            placeholder="What's happening?"
            counter
            autogrow
            maxlength="280"
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="https://res.cloudinary.com/idaproject/image/upload/v1647200504/user_gy1v9e.jpg" />
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            rounded
            no-caps
            class="q-mb-lg"
            unlevated
            label="Qweet"
            color="primary"
            :disable="!newQweetContent"
            @click="addNewQweet"
          />
        </div>
      </div>
      <q-separator class="divider" color="gray-2" size="10px"></q-separator>

      <div class="q-pa-md q-gutter-md">
        <q-list separator>
          <transition-group
            appear
            enter-active-class="animated fadeIn slow"
            leave-active-class="animated fadeOut slow"
          >
            <q-item
              class="q-py-md qweet"
              v-for="qweet in qweets"
              :key="qweet.date"
            >
              <q-item-section avatar top>
                <q-avatar>
                  <img src="https://res.cloudinary.com/idaproject/image/upload/v1647200504/user_gy1v9e.jpg" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="teext-subtitle1">
                  <strong>Ali </strong>
                  <span class="text-grey-7">
                    @ali_6780 </span
                  >
                </q-item-label>
                <q-item-label class="qweet-content text-body1">
                  {{ qweet.content }}
                </q-item-label>
                <div class="row justify-between qweet-icons q-mt-sm">
                  <q-btn
                    flat
                    round
                    color="grey"
                    icon="far fa-comment"
                    size="sm"
                  />
                  <q-btn
                    flat
                    round
                    color="grey"
                    icon="fas fa-retweet"
                    size="sm"
                  />
                  <q-btn
                    @click="toggleLiked(qweet)"
                    :color="qweet.liked ? 'pink' : 'grey'"
                    :icon="qweet.liked ? 'fas fa-heart' : 'far fa-heart' "
                    flat
                    round
                    size="sm"
                  />
                  <q-btn
                  @click="deleteQweet(qweet)"
                    flat
                    round
                    color="grey"
                    icon="fas fa-trash"
                    size="sm"
                  />
                </div>
              </q-item-section>

              <q-item-section side top> </q-item-section>
            </q-item>
          </transition-group>
        </q-list>
      </div>
    </q-scroll-area>
  </q-page>
</template>

<script>
import db from './../boot/firebase'

export default {
  props: {},
  name: "PageHome",
  data() {
    return {
      newQweetContent: "",
      qweets: [],
    };
  },
  methods: {
    addNewQweet() {
      let newQweet = {
        content: this.newQweetContent,
        date: Date.now(),
        liked: false
      };
      db.collection('qweets').add(newQweet)
      .then((docRef) => {
          console.log('Document written with ID: ', docRef.id);
      })
      .catch((error) => {
          console.error('Error adding document: ', error);
      });
      this.newQweetContent = "";
    },

    deleteQweet(qweet) {
      db.collection('qweets').doc(qweet.id).delete().then(() => {
        console.log('Document successfully deleted!');
          }).catch((error) => {
        console.error('Error removing document: ', error);
          });
    },

    toggleLiked(qweet) {
      db.collection('qweets').doc(qweet.id).update({
          liked: !qweet.liked
      })
      .then(() => {
          console.log('Document successfully updated!');
      })
      .catch((error) => {
          console.error('Error updating document: ', error);
      });
    }
    
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date());
    },
  },
  mounted() {
    db.collection("qweets").orderBy('date')
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let qweetChange = change.doc.data()
          qweetChange.id = change.doc.id
            if (change.type === 'added') {
                console.log('New qweet: ', qweetChange)
                this.qweets.unshift(qweetChange)
            }
            if (change.type === 'modified') {
                console.log('Modified qweet: ', qweetChange)
                let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id)
                Object.assign(this.qweets[index], qweetChange)
            }
            if (change.type === 'removed') {
                console.log('Removed qweet: ', qweetChange)
                let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id)
                this.qweets.splice(index, 1)
            }
        })
    })
  }
};
</script>
<style lang="sass">
.new-qweet
  textarea
    font-size: 19px
    line-height: 1.4

.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4
.qweet-content
  white-space: pre-line
.qweet-icons
  margin-left: -5px
.qweet:not(:first-child)
  border-top: 1px solid rgba(0, 0, 0, 0.12)
</style>
