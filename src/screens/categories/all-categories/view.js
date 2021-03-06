import React from 'react';
import {
  AllCategoriesWrapper,
  CategoryWrapper,
  CategoryName,
  CategoryAction,
  CategoryEditBtn,
  CategoryDeleteAction,
  ErrorText,
} from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../../utils/color';
import {Query} from 'react-apollo';
import {useMutation} from '@apollo/client';
import AppLoader from '../../components/loader';
import {GET_CATEGORIES, DELETE_CATEGORY} from '../../../queries/productQueries';
import {useIsFocused} from '@react-navigation/native';
import {Alert, View} from 'react-native';
import {unflatten} from '../../../utils/helper';
import MainContainer from '../../components/mainContainer';
import {GraphqlError, GraphqlSuccess} from '../../components/garphqlMessages';

const AllCategoriesView = ({navigation}) => {
  const isFocused = useIsFocused();
  return (
    <MainContainer>
      <AllCategoriesWrapper>
        <Query query={GET_CATEGORIES}>
          {({loading, error, data, refetch}) => {
            const [deleteCat, {loading: deleteLoading}] = useMutation(
              DELETE_CATEGORY,
              {
                onError: (error) => {
                  GraphqlError(error);
                },
                onCompleted: (data) => {
                  GraphqlSuccess('Deleted successfully');
                  refetch();
                },
              },
            );

            if (isFocused) {
              refetch();
            }
            if (loading) {
              return <AppLoader />;
            }
            if (error) {
              GraphqlError(error);
              return (
                <ErrorText>
                  Something went wrong. Please try again later
                </ErrorText>
              );
            }

            var allcategories = unflatten(data.productCategories);
            const categoriesListing = (categories) => {
              return categories.map((category, i) =>
                category.children && category.children.length > 0 ? (
                  <View key={i}>
                    <CategoryWrapper>
                      <CategoryName
                        style={{
                          paddingLeft: category.parentId === null ? 0 : 10,
                        }}>
                        {category.parentId === null
                          ? category.name
                          : `-- ${category.name}`}
                      </CategoryName>
                      <CategoryAction>
                        <CategoryEditBtn
                          onPress={() => {
                            navigation.navigate('CategoryScreen', {
                              screen: 'EditCategory',
                              params: {singleCategory: category},
                            });
                          }}>
                          <Icon name="pencil" size={15} color="#000" />
                        </CategoryEditBtn>
                        <CategoryDeleteAction
                          onPress={() => {
                            Alert.alert(
                              'Ooops',
                              'Currently not deleted because if this category have sub-menus  ',
                              [
                                {
                                  text: 'Cancel',
                                  style: 'cancel',
                                },
                                {
                                  text: 'OK',
                                  onPress: () => {
                                    // deleteCat({variables: {id: category.id}}),
                                  },
                                },
                              ],
                              {cancelable: false},
                            );
                          }}>
                          <Icon
                            name="trash"
                            size={15}
                            color={Colors.deleteColor}
                          />
                        </CategoryDeleteAction>
                      </CategoryAction>
                    </CategoryWrapper>
                    <View
                      style={{
                        paddingLeft: 12,
                        backgroundColor: '#fff',
                      }}>
                      {categoriesListing(category.children)}
                    </View>
                  </View>
                ) : (
                  <CategoryWrapper key={i}>
                    <CategoryName
                      style={{
                        paddingLeft: category.parentId === null ? 0 : 10,
                      }}>
                      {category.parentId === null
                        ? category.name
                        : `-- ${category.name}`}
                    </CategoryName>
                    <CategoryAction>
                      <CategoryEditBtn
                        onPress={() => {
                          navigation.navigate('CategoryScreen', {
                            screen: 'EditCategory',
                            params: {singleCategory: category},
                          });
                        }}>
                        <Icon name="pencil" size={15} color="#000" />
                      </CategoryEditBtn>
                      <CategoryDeleteAction
                        onPress={() => {
                          Alert.alert(
                            'Ooops',
                            'Currently not deleted because if this category have sub-menus  ',
                            [
                              {
                                text: 'Cancel',
                                style: 'cancel',
                              },
                              {
                                text: 'OK',
                                onPress: () => {
                                  // deleteCat({variables: {id: category.id}}),
                                },
                              },
                            ],
                            {cancelable: false},
                          );
                        }}>
                        <Icon
                          name="trash"
                          size={15}
                          color={Colors.deleteColor}
                        />
                      </CategoryDeleteAction>
                    </CategoryAction>
                  </CategoryWrapper>
                ),
              );
            };

            return (
              <>
                {deleteLoading ? <AppLoader /> : null}
                {categoriesListing(allcategories)}
              </>
            );
          }}
        </Query>
      </AllCategoriesWrapper>
    </MainContainer>
  );
};

export default AllCategoriesView;
