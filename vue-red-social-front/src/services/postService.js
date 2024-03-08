import axios from "axios";
import Post from "@/models/post";
import Coment from "@/models/coment";
import User from "@/models/user";

class postService {
  getPost() {
    const url = "http://localhost:1337/api/posts";
    // Realiza la solicitud HTTP de tipo GET
    return axios.get(url).then(({ data }) => {
      const postList = data.data.map(({ id, attributes }) => {
        return {
          ...attributes.post,
          id: id,
        };
      });
      return postList.map((item) => {
        return Post.fromJson(item);
      });
    });
  }

  postPost(post) {
    const url = "http://localhost:1337/api/posts/";

    let postApi = {
      data: {
        post,
      },
    };
    // Realiza la solicitud HTTP de tipo POST
    axios
      .post(url, postApi)
      .then(() => {
        console.log("Solicitud POST exitosa");
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud POST", error);
      });
  }

  putPost(post) {
    const url = `http://localhost:1337/api/posts/${post.id}`;

    let postApi = {
      data: {
        post,
      },
    };
    console.log(postApi);
    // Realiza la solicitud HTTP de tipo PUT
    axios
      .put(url, postApi)
      .then(() => {
        console.log("Solicitud PUT exitosa");
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud PUT", error);
      });
  }

  deletePost(post) {
    const url = `http://localhost:1337/api/posts/${post.id}`;
    // Realiza la solicitud HTTP de tipo DELETE
    return axios
      .delete(url)
      .then(() => {
        console.log("Solicitud DELETE exitosa");
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud DELETE", error);
      });
  }

  getComent() {
    const url = "http://localhost:1337/api/coments";
    // Realiza la solicitud HTTP de tipo GET
    return axios.get(url).then(({ data }) => {
      const comentList = data.data.map(({ id, attributes }) => {
        return {
          ...attributes.coment,
          id: id,
        };
      });
      return comentList.map((item) => {
        return Coment.fromJson(item);
      });
    });
  }

  postComent(coment) {
    const url = "http://localhost:1337/api/coments/";

    let comentApi = {
      data: {
        coment,
      },
    };
    // Realiza la solicitud HTTP de tipo POST
    axios
      .post(url, comentApi)
      .then(() => {
        console.log("Solicitud POST exitosa");
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud POST", error);
      });
  }

  deleteComent(coment) {
    const url = `http://localhost:1337/api/coments/${coment.id}`;
    // Realiza la solicitud HTTP de tipo DELETE
    return axios
      .delete(url)
      .then(() => {
        console.log("Solicitud DELETE exitosa");
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud DELETE", error);
      });
  }

  getUser() {
    const url = "http://localhost:1337/api/users-posts";
    // Realiza la solicitud HTTP de tipo GET
    return axios.get(url).then(({ data }) => {
      const userList = data.data.map(({ id, attributes }) => {
        return {
          ...attributes.user,
          id: id,
        };
      });
      return userList.map((item) => {
        return User.fromJson(item);
      });
    });
  }

  putUser(user) {
    const url = `http://localhost:1337/api/users-posts/${user.id}`;

    let userApi = {
      data: {
        user,
      },
    };
    // Realiza la solicitud HTTP de tipo PUT
    axios
      .put(url, userApi)
      .then(() => {
        console.log("Solicitud PUT exitosa");
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud PUT", error);
      });
  }

  postUser(user) {
    const url = "http://localhost:1337/api/users-posts";

    let userApi = {
      data: {
        user,
      },
    };

    return axios
      .post(url, userApi)
      .then((response) => {
        const newUser = {
          ...response.data.data.attributes.user,
          id: response.data.data.id,
        };
        console.log("Solicitud POST exitosa");
        // Retorna la nueva data
        return User.fromJson(newUser);
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud POST", error);
        throw error;
      });
  }
}
export default postService;
