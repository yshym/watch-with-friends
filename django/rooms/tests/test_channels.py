from channels.testing import ChannelsLiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support.ui import Select
from webdriver_manager.chrome import ChromeDriverManager
from django.contrib.auth import get_user_model, login

from ..models import Room


class RoomChannelsTestCase(ChannelsLiveServerTestCase):
    serve_static = True  # emulate StaticLiveServerTestCase

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        try:
            cls.driver = webdriver.Chrome()
        except:
            super().tearDownClass()
            raise

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()
        super().tearDownClass()

    def setUp(self):
        # Create user
        self.username = 'testuser1'
        self.password = 'testpass123'

        self._signup(self.username, self.password)
        # self._login(username=self.username, password=self.password)

        # Create rooms
        self._create_room(
            name='room1',
            youtube_link='https://www.youtube.com/watch?v=1cQh1ccqu8M',
        )

        self._create_room(
            name='room2',
            youtube_link='https://www.youtube.com/watch?v=DmeUuoxyt_E',
        )

    def test_when_chat_message_posted_then_seen_by_everyone_in_same_room(self):
        try:
            self._enter_room('room1')

            self._open_new_window()
            self._enter_room('room1')

            self._switch_to_window(0)
            self._post_message('hello')
            WebDriverWait(self.driver, 2).until(
                lambda _: 'hello' in self._chat_log_value,
                'Message was not received by window 1 from window 1',
            )
            self._switch_to_window(1)
            WebDriverWait(self.driver, 2).until(
                lambda _: 'hello' in self._chat_log_value,
                'Message was not received by window 2 from window 1',
            )
        finally:
            self._close_all_new_windows()

    def test_when_chat_message_posted_then_not_seen_by_anyone_in_different_room(
        self,
    ):
        try:
            self._enter_room('room1')

            self._open_new_window()
            self._enter_room('room2')

            self._switch_to_window(0)
            self._post_message('hello')
            WebDriverWait(self.driver, 2).until(
                lambda _: 'hello' in self._chat_log_value,
                'Message was not received by window 1 from window 1',
            )

            self._switch_to_window(1)
            self._post_message('world')
            WebDriverWait(self.driver, 2).until(
                lambda _: 'world' in self._chat_log_value,
                'Message was not received by window 2 from window 2',
            )
            self.assertTrue(
                'hello' not in self._chat_log_value,
                'Message was improperly received by window 2 from window 1',
            )
        finally:
            self._close_all_new_windows()

    # === Utility ===

    def _signup(self, username, password):
        self.driver.get(self.live_server_url + '/accounts/signup/')

        username_input = self.driver.find_element_by_id('id_username')
        password_input1 = self.driver.find_element_by_id('id_password1')
        password_input2 = self.driver.find_element_by_id('id_password2')

        username_input.send_keys(username)
        password_input1.send_keys(password)
        password_input2.send_keys(password)

        self.driver.find_element_by_name('submit').click()
        WebDriverWait(self.driver, 2).until(
            lambda _: 'signup' not in self.driver.current_url
        )

    def _login(self, username, password):
        self.driver.get(self.live_server_url + '/accounts/login/')

        username_input = self.driver.find_element_by_id('id_login')
        password_input = self.driver.find_element_by_id('id_password')

        username_input.send_keys(username)
        password_input.send_keys(password)

        self.driver.find_element_by_name('submit').click()
        WebDriverWait(self.driver, 2).until(
            lambda _: 'login' not in self.driver.current_url
        )

    def _logout(self):
        self.driver.get(self.live_server_url + '/accounts/logout/')
        WebDriverWait(self.driver, 2).until(
            lambda _: 'logout' not in self.driver.current_url
        )

    def _create_room(self, name, youtube_link=None, video=None):
        self.driver.get(self.live_server_url + '/create')

        name_input = self.driver.find_element_by_id('id_name')
        video_type_select = Select(
            self.driver.find_element_by_id('id_video_type')
        )
        video_input = self.driver.find_element_by_id('id_video')
        youtube_link_input = self.driver.find_element_by_id('id_youtube_link')
        submit_button = self.driver.find_element_by_name('submit')

        name_input.send_keys(name)
        if youtube_link:
            video_type_select.select_by_visible_text('YouTube')
            youtube_link_input.send_keys(youtube_link)

        submit_button.click()

    def _enter_room(self, room_name):
        self.driver.get(self.live_server_url + '')

        room = Room.objects.get(name=room_name)
        room_id_str = str(room.id)

        room_name_select = Select(self.driver.find_element_by_id('id_name'))
        room_enter_button = self.driver.find_element_by_id('room-name-submit')

        room_name_select.select_by_visible_text(room_name)
        room_enter_button.click()

        WebDriverWait(self.driver, 2).until(
            lambda _: room_id_str in self.driver.current_url
        )

    def _open_new_window(self):
        self.driver.execute_script("window.open('about:blank', '_blank');")
        self.driver.switch_to_window(self.driver.window_handles[-1])

    def _close_all_new_windows(self):
        while len(self.driver.window_handles) > 1:
            self.driver.switch_to_window(self.driver.window_handles[-1])
            self._close_window()
        if len(self.driver.window_handles) == 1:
            self.driver.switch_to_window(self.driver.window_handles[0])

    def _close_window(self):
        self.driver.execute_script('window.close();')

    def _switch_to_window(self, window_index):
        self.driver.switch_to_window(self.driver.window_handles[window_index])

    def _post_message(self, message):
        chat_message_input = self.driver.find_element_by_id(
            'chat-message-input'
        )
        chat_message_submit_button = self.driver.find_element_by_id(
            'chat-message-submit'
        )

        chat_message_input.send_keys(message)
        chat_message_submit_button.click()

    @property
    def _chat_log_value(self):
        return self.driver.find_element_by_css_selector(
            '#chat-log'
        ).get_property('textContent')

    @property
    def _chat_input_value(self):
        return self.driver.find_element_by_css_selector(
            '#chat-message-input'
        ).get_property('value')
