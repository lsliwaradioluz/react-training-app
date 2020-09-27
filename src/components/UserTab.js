import {
  React,
  styled,
  colors,
  NavLink,
  apolloClient,
  connect,
  cloneDeep,
} from "src/imports/react";
import Avatar from "src/components/Avatar";
import { ContextMenu } from "src/imports/components";
import { UPDATE_USER, DELETE_USER, GET_USERS } from "src/imports/apollo";
import { setNotification } from "src/store/actions";

const UserTab = (props) => {
  const archiveUser = () => {
    const input = {
      id: props.user.id,
      active: props.user.active ? false : true,
    };

    apolloClient
      .mutate({ mutation: UPDATE_USER, variables: { input } })
      .then(() => {
        const message = props.user.active
          ? "Podopieczny został przeniesiony do archiwum."
          : "Podopieczny znów jest aktywny.";
        props.setNotification(message);
        props.onUserArchive();
      })
      .catch((err) => console.log(err));
  };

  const transferUser = () => {};

  const deleteUser = async () => {
    try {
      await apolloClient.mutate({
        mutation: DELETE_USER,
        variables: { id: props.user.id },
        update: (cache, { data: { deleteUser } }) => {
          const { users } = cloneDeep(
            cache.readQuery({
              query: GET_USERS,
              variables: { id: props.coach.id },
            })
          );

          this.client.writeQuery({
            query: GET_USERS,
            data: { users: users.filter((user) => user.id !== deleteUser.id) },
          });
        },
      });

      props.setNotification("Podopieczny usunięty pomyślnie");
    } catch (err) {
      props.setNotification("Wystąpił błąd. Sprawdź połączenie z Internetem");
    }
  };

  const renderButtons = () => {
    const buttons = [
      {
        caption: props.user.active ? "Archiwizuj" : "Przywróć",
        icon: "pencil",
        callback: archiveUser,
      },
    ];
    if (!props.user.active) {
      buttons.push({
        caption: "Usuń",
        icon: "trash",
        callback: deleteUser,
      });
    }
    return buttons;
  };

  return (
    <$UserTab>
      <$UserData to={`${props.pathname}/${props.user.id}`}>
        <$Avatar
          url={props.user.image && props.user.image.url}
          height={50}
          width={50}
        />
        <div>
          <$Username>{props.user.username}</$Username>
          <$Fullname>{props.user.fullname}</$Fullname>
        </div>
      </$UserData>
      {props.user.admin ? null : <$ContextMenu buttons={renderButtons()} />}
    </$UserTab>
  );
};

const $UserTab = styled.div`
  display: block;
  padding: 0.5rem 0 !important;
  text-decoration: none;
  display: flex;
  align-items: flex-start;
`;

const $UserData = styled(NavLink)`
  display: flex;
  width: 100%;
`;

const $Avatar = styled(Avatar)`
  margin-right: 0.5rem;
`;

const $Username = styled.h4`
  color: white;
  margin: 0;
`;

const $Fullname = styled.p`
  color: ${colors.faded};
  font-size: 13px;
  margin-bottom: 0;
`;

const $ContextMenu = styled(ContextMenu)`
  align-self: center;
  margin-left: auto;
  color: ${colors.headers};
`;

const mapStateToProps = (state) => {
  return {
    coach: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notification) => dispatch(setNotification(notification)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserTab);
