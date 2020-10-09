import {
  React,
  styled,
  colors,
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
        props.refetchUsers();
      })
      .catch((err) => console.log(err));
  };

  const deleteUser = async () => {
    try {
      await apolloClient.mutate({
        mutation: DELETE_USER,
        variables: { id: props.user.id },
        update: (cache, { data: { deleteUser } }) => {
          try {
            const { users } = cloneDeep(
              cache.readQuery({
                query: GET_USERS,
                variables: { id: props.coach.id },
              })
            );

            apolloClient.writeQuery({
              query: GET_USERS,
              variables: { id: props.coach.id },
              data: {
                users: users.filter((user) => user.id !== deleteUser.id),
              },
            });
          } catch (err) {
            console.log(err);
          }
        },
      });
      props.refetchUsers()
      props.setNotification("Podopieczny usunięty pomyślnie");
    } catch (err) {
      console.log(err);
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

  const isDisabled = () => {
    return (
      (props.workoutToCopy && props.user.id === props.workoutToCopy.user.id) ||
      (props.workoutToPair && props.user.id === props.workoutToPair.user.id)
    );
  };

  const navigate = () => {
    if (isDisabled()) {
      const notification =
        props.workoutToCopy && props.workoutToCopy.user.id === props.user.id
          ? "Kopiujesz już trening tego użytkownika!"
          : "Parujesz już trening tego użytkownika!";
      props.setNotification(notification);
      return;
    } else {
      props.history.push(`${props.history.location.pathname}/${props.user.id}`);
    }
  };

  return (
    <$UserTab>
      <$UserData onClick={navigate} disabled={isDisabled()}>
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
  @media (min-width: 1024px) {
    flex-basis: 23%;
    flex-grow: 0;
    &:hover {
      opacity: 0.8;
    }
  }
`;

const $UserData = styled.div`
  display: flex;
  width: 100%;
  @media (min-width: 1024px) {
    flex-direction: column;
  }
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const $Avatar = styled(Avatar)`
  margin-right: 0.5rem;
  @media (min-width: 1024px) {
    margin: 0 0 1rem 0;
    width: 100%;
    height: 100%;
  }
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
  @media (min-width: 1024px) {
    display: none;
  }
`;

const mapStateToProps = (state) => {
  return {
    coach: state.main.user,
    workoutToCopy: state.workouts.workoutToCopy,
    workoutToPair: state.workouts.workoutToPair,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notification) => dispatch(setNotification(notification)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserTab);
